import React, { Component } from 'react';
import './App.css';
import FlightList from './Components/FlightList';
import Modal from 'react-modal';

export default class App extends Component{

  constructor(props) {
    super(props);
    this.state = {price: 0, token: null, formData: null, openModal: false, error: null};
  }
  
  componentDidMount() {
    this.initializeSpreedlyExpress(false);
    window.addEventListener('beforeunload', this.componentCleanup);
  }

  sendPayment = (retain_on_success) => {
    const amount = this.state.price;
    Modal.setAppElement('#AppId');

    fetch(`http://localhost:8000/spreedly`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({token: this.state.token, formData: this.state.formData, amount, retain_on_success})
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

  openExpress = (flight) => {
    console.log(flight.price)
    this.setState({price: parseInt(flight.price*100)}); 
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
    <Modal isOpen={this.state.openModal} onRequestClose={this.closeModal}>
      <p>Do you want to save this card for future use?</p>
      <button className="modalButton" onClick={()=>this.sendPayment(false)}> No Thanks </button>
      <button className="modalButton" onClick={()=>this.sendPayment(true)}> Yes Please </button>
    </Modal>
  </div>
  );}
}
