import React from 'react';
import { List, Avatar, Space } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import dummychart from '../dummychart.png';
import { Link } from 'react-router-dom';
//import expandedRowRender from './PortfolioExpandebleRows';




import { Table, Badge, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

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

const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);

const transactionsTable = entry => {
  const columns = [
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Price', dataIndex: 'price_at', key: 'price_at' },
    { title: 'Date', dataIndex: 'date_posted', key: 'date_posted' },
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
  
 /* const expandedRowRender = () => { //this probably needs to be moved to its own component to match the transaction symbols with the portfolio symbols
    const columns = [
      { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
      { title: 'Amount', dataIndex: 'amount', key: 'amount' },
      { title: 'Action', dataIndex: 'action', key: 'action' },
      { title: 'Price', dataIndex: 'price', key: 'price' },
      { title: 'Date', dataIndex: 'date_posted', key: 'date_posted' },
    ];

    const modifiedtransactions = []; //Not useful atm
    let i = 0;
    for (let portfolio of props.portfolio) {
      for (let transaction of props.transactions) {
        if (portfolio.symbol === transaction.symbol) {
          modifiedtransactions.push({
            key: i,
            symbol: transaction.symbol,
            action: 'buy',
            amount: transaction.amount,
            price: '',
            date: transaction.date_posted,
          });
          i += 1;
        }
      }

    }

    return <Table columns={columns} dataSource={fullportfolio.transaction} pagination={false} />;
  };*/
  const columns = [
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Owner', dataIndex: 'user', key: 'user' },
    { title: 'Date of last purchase', dataIndex: 'date_posted', key: 'date_posted' },
    { title: 'Action', key: 'operation', render: () => <a>Action!</a> },
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