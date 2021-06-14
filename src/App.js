import React, { Component } from 'react';
import './App.css';
// import SpreedlyExpress from './spreedlyExpress'

export default class App extends Component{
  
  componentDidMount() {
    window.SpreedlyExpress.init(process.env.REACT_APP_SPREEDLY_ENVIRONMENT_KEY, {
      "amount": "$0",
      "company_name": "Spreedly Airlines",
      "sidebar_top_description": "Onboarding Spreedly one flight at a time",
      "sidebar_bottom_description": "Your order total today",
    }, {
      "email": "customer@gmail.com"
    });

    window.addEventListener('beforeunload', this.componentCleanup);
  }

  openExpress() {
    window.SpreedlyExpress.openView();
  }

  componentCleanup() {
    window.SpreedlyExpress.unload();
  }

  componentWillUnmount() {
    this.componentCleanup()
  }
  
  render () {return (
  <div className="App">
    <button onClick= {this.openExpress}>button</button>
  </div>
  );}
}
