import React, { Component } from 'react';
import './App.css';
import FlightList from './Components/FlightList';

export default class App extends Component{

  constructor(props) {
    super(props);
    this.state = {price: 0, retain_on_success: false, error: null};
  }
  
  componentDidMount() {
    this.initializeSpreedlyExpress(false);
    window.addEventListener('beforeunload', this.componentCleanup);
  }

  sendPayment = (token, formData) => {
    console.log(JSON.stringify({token, formData}))
    console.log({token, formData})
    const amount = this.state.price;
    const retain_on_success = this.state.retain_on_success;
    fetch(`http://localhost:8000/spreedly`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({token, formData, amount, retain_on_success})
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
    }
    window.SpreedlyExpress.init(process.env.REACT_APP_SPREEDLY_ENVIRONMENT_KEY, {
            "amount": "$0",
            "company_name": "Spreedly Airlines",
            "sidebar_top_description": "Onboarding Spreedlings one flight at a time",
            "sidebar_bottom_description": "Your order total today",
    });
    window.SpreedlyExpress.onPaymentMethod(this.sendPayment)
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
  <div className="App">
    <h1>Spreedly Flights</h1>
    {this.state.error ? <p onClick={this.clearError} className="error">{this.state.error}</p> : <></>}
    <FlightList openExpress={this.openExpress}/>
  </div>
  );}
}
