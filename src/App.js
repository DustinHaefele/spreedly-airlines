import React, { Component } from 'react';
import './App.css';
import FlightList from './Components/FlightList';
import TransactionList from './Components/TransactionList';

import Modal from 'react-modal';

export default class App extends Component{

  constructor(props) {
    super(props);
    this.state = {price: 0, token: null, formData: null, openModal: false, error: null, bookExternal: false, showTransactions: false};
  }
  
  componentDidMount() {
    this.initializeSpreedlyExpress(false);
    this.getTransactions();
    window.addEventListener('beforeunload', this.componentCleanup);
  }

  getTransactions() {
    const url = "http://localhost:8000/spreedly/transactions"
    fetch(url, {
      method: 'GET',
      })
        .then(res => res.json()
        ).then(response => {
          console.log({response})
          this.setState({transactions:response})
          if(response.error) {
            this.setState({error: response.error})
            console.log(response.error);
          }
        })
  }

  sendPayment = (retain_on_success) => {
    const amount = this.state.price;
    Modal.setAppElement('#AppId');
    const url = this.state.bookExternal ? "http://localhost:8000/spreedly/receiver" : "http://localhost:8000/spreedly"

    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({token: this.state.token, formData: this.state.formData, amount, retain_on_success, product_id: "916598"})
      })
        .then(res => res.json()
        ).then(response => {
          console.log({response})
          if(response.error) {
            this.setState({error: response.error})
            console.log(response.error);
          }
          this.initializeSpreedlyExpress(true);
        })
      
  }

  initializeSpreedlyExpress = (isInit) => {
    if(isInit) {
      window.SpreedlyExpress.unload();
      this.setState({openModal: false})
    }
    window.SpreedlyExpress.init(process.env.REACT_APP_SPREEDLY_ENVIRONMENT_KEY, {
            "amount": "$0",
            "company_name": "Spreedly Airlines",
            "sidebar_top_description": "Onboarding Spreedlings one flight at a time",
            "sidebar_bottom_description": "Your order total today",
    });
    window.SpreedlyExpress.onPaymentMethod(this.onPaymentMethod)
  }

  onPaymentMethod = (token, formData) => {
    this.setState({openModal: true, token, formData})
  }

  openExpress = (flight, bookExternal) => {
    console.log(flight.price)
    this.setState({price: parseInt(flight.price*100), bookExternal}); 
    window.SpreedlyExpress.setDisplayOptions({
      "amount": `$${flight.price}`,
      "sidebar_bottom_description": `${flight.source} -> ${flight.destination}`
      })
    window.SpreedlyExpress.openView();
  }

  componentCleanup = () => {
    window.SpreedlyExpress.unload();
  }

  componentWillUnmount = () => {
    this.componentCleanup()
  }

  clearError = () => {
    this.setState({error:null})
  }
  
  render () {return (
  <div className="App" id="AppId">
    <h1>Spreedly Flights</h1>
    {this.state.error ? <p onClick={this.clearError} className="error">{this.state.error}</p> : <></>}
    <FlightList openExpress={this.openExpress}/>
    {this.state.showTransactions ? <TransactionList transactions={this.state.transactions}/> : <></>}
    {this.state.showTransactions ? <button onClick={() => this.setState({showTransactions: false})}>Hide Transaction list</button> : <button onClick={() => this.setState({showTransactions: true})}>Show Transaction list</button>}
    <Modal isOpen={this.state.openModal} onRequestClose={this.closeModal} ariaHideApp={false}>
      <p>Do you want to save this card for future use?</p>
      <button className="modalButton" onClick={()=>this.sendPayment(false)}> No Thanks </button>
      <button className="modalButton" onClick={()=>this.sendPayment(true)}> Yes Please </button>
    </Modal>
  </div>
  );}
}
