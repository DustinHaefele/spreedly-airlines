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
      {props.flight.externallySourced ? <button onClick={()=>props.onSelect(props.flight, true)}>Book Flight w/ Echo Flights</button> : <button onClick={()=>props.onSelect(props.flight, false)}>Book This Flight</button>}
    </li>
  );
}

export default FlightItem;