import React from 'react';
import './FlightItem.css'

function TransactionItem(props) {

  return (
    <li className='flightItem'>
      <p className='flightInfo'>Date: {props.transaction.updated_at}</p>
      <p className='flightInfo'>State: {props.transaction.state}</p>
      <p className='flightInfo'>Amount: ${props.transaction.amount / 100.00}</p>
    </li>
  );
}

export default TransactionItem;