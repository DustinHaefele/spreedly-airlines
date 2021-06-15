import React from 'react';
import './FlightItem.css'

function FlightItem(props) {

  return (
    <li className='flightItem'>
      <p className='flightInfo'>Source: {props.flight.source}</p>
      <p className='flightInfo'>Destination: {props.flight.destination}</p>
      <p className='flightInfo'>Date: {props.flight.flightDate}</p>
      <p className='flightInfo'>Flight Time: {props.flight.flightTime}</p>
      <p className='flightInfo'>Price: ${props.flight.price}</p>
      <button onClick={()=>props.onSelect(props.flight)}>Book This Flight</button>
    </li>
  );
}

export default FlightItem;