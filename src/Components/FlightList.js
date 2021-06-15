import React from 'react';
import FlightItem from './FlightItem';
import "./FlightList.css";
import flights from '../flights';

export default class FlightList extends React.Component {

  displayFlights(flights, onSelect){
    if(flights){
    return flights.map((flight, idx) => <FlightItem key={idx} flight={flight} onSelect={onSelect} />)
  }
    return;
  }

  render(){
    return (
      <div className='flightList-wrapper'>
        <h2 className='title'>Flights to purchase</h2>
        <ul className='FlightList'>
          {this.displayFlights(flights, this.props.openExpress)}
        </ul>
      </div>
    )
  }
}