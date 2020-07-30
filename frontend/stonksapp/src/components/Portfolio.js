import React from 'react';
import { Table } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';


/*  What do i want in my portfolio?
      -> Symbol
      -> Amount owned
      -> Price purchased
        -> [date of last purchase]?
      -> Price change today
      -> Actual Price
        -> [Amount won/lost]?
        -> [Cash value of each position]?
      -> Mark to market value of entire protfolio
*/

const transactionsTable = entry => {
  const columns = [
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol',  responsive:["lg"] },
    { title: 'Price', dataIndex: 'price_at', key: 'price_at' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Date', dataIndex: 'date_posted', key: 'date_posted',  responsive:["lg"] },
  ];

  const transactions = [];
  let i = 0;
  for(let transaction of entry){
    let action = ''
    if(transaction.amount > 0){
      action = 'Buy'
    }else{
      action = 'Sell'
    }
    transactions.push({
      key: i,
      symbol: transaction.symbol,
      amount: transaction.amount,
      price_at: transaction.price_at,
      date_posted: new Date(transaction.date_posted).toDateString(),
      action: action,
    })
  }

  return <Table columns={columns} dataSource={transactions} pagination={false} />; 
}

function Portfolio(props) {
  const fullportfolio = [];
  const columns = [
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol'} ,
    { title: 'Price', dataIndex: 'price', key: 'price'},
    { title: 'Amount', dataIndex: 'amount', key: 'amount'},
    { title: 'Owner', dataIndex: 'user', key: 'user' ,responsive:["lg"]},
    { title: 'Date of last purchase', dataIndex: 'date_posted', key: 'date_posted', responsive:["lg"] },
 //   { title: 'Action', key: 'operation', render: () => <a>Action!</a> },
  ];

  for (let portfolio of props.portfolio) {
    var latestdate = 1;
    var priceavg = 0;
    for (let transactions of props.transactions) {
      if (portfolio.symbol == transactions.symbol) {
        priceavg += (transactions.price_at * transactions.amount);
        if (latestdate === 1 | latestdate < transactions.date_posted) {
          latestdate = transactions.date_posted;
        }
      }
    }
    priceavg = priceavg / portfolio.amount;
    
    fullportfolio.push({
      key: portfolio.symbol,
      symbol: portfolio.symbol,
      amount: portfolio.amount,
      user: portfolio.user,
      price: parseFloat(priceavg).toFixed(2),
      date_posted: new Date(latestdate).toDateString(),
      transaction: props.transactions.filter(tr => tr.symbol == portfolio.symbol),
    });
  }

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandable={{ expandedRowRender: record =>  transactionsTable(record.transaction) } }
      dataSource={fullportfolio}
    />
  );
}


export default Portfolio;