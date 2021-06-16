import React from 'react';
import TransactionItem from './TransactionItem';


export default class TransactionList extends React.Component {

  displayTransactions(transactions){
    if(transactions){
    return transactions.map((transaction, idx) => <TransactionItem key={idx} transaction={transaction} />)
  }
    return;
  }

  render(){
    return (
      <div className='transactionList-wrapper'>
        <h2 className='title'>Transactions</h2>
        <ul className='TransactionList'>
          {this.displayTransactions(this.props.transactions)}
        </ul>
      </div>
    )
  }
}