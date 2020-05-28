import React from 'react';
import { List, Avatar, Space } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import dummychart from '../dummychart.png';
import { Link } from 'react-router-dom';




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

function Portfolio(props) {
  const expandedRowRender = () => { //this probably needs to be moved to its own component to match the transaction symbols with the portfolio symbols
    const columns = [
      { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
      { title: 'Amount', dataIndex: 'amount', key: 'amount' },
      { title: 'Action', dataIndex: 'action', key: 'action' },
      { title: 'Price', dataIndex: 'price', key: 'price'},
      { title: 'Date', dataIndex: 'date_posted', key: 'date_posted' },
     /* {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <span className="table-operation">
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown overlay={menu}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </span>
        ),
      },*/
    ];


    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        symbol: 'TSLA',
        action: 'Buy/Sell',
        amount: '99',
        price: '13,37$',
        date_posted: '01.01.1970'
      });
    }
    const modifiedtransactions = []; //Not useful atm
    for(let portfolio of props.portfolio){
      for(let transaction of props.transactions){
        if(portfolio.symbol === transaction.symbol){
          modifiedtransactions.push({
            symbol: transaction.symbol,
            action: 'buy',
            amount: transaction.amount,
            price: '',
            date: transaction.date_posted,
          });
        }
      }
    }

    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  const columns = [ // Some warning about symbols/primary key; needs to be fixed
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Owner', dataIndex: 'user', key: 'user' },
    { title: 'Date of last pruchase', dataIndex: 'date_posted', key: 'date_posted' },
    { title: 'Action', key: 'operation', render: () => <a>i will do somethin with this link i swear</a> },
  ];

  /*      //All fields are being expanded because the portfolios in props.data are missing a key property 
  const data = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      name: 'Screem',
      platform: 'iOS',
      version: '10.3.4.5654',
      upgradeNum: 500,
      creator: 'Jack',
      createdAt: '2014-12-24 23:12:00',
    });
  }
  */
  const fullportfolio = []; //////PRICE BUUGY
  for(let portfolio of props.portfolio){
    var latestdate = 1;
    var priceavg = 0;
    for(let transactions of props.transactions){
      if(portfolio.symbol == transactions.symbol){
        priceavg += (transactions.price_at*transactions.amount);
        if(latestdate === 1 | latestdate < transactions.date_posted){
          latestdate = transactions.date_posted;

        }
      }
    }
    priceavg = priceavg/portfolio.amount;
    fullportfolio.push({
      symbol: portfolio.symbol,
      amount: portfolio.amount,
      user: portfolio.user,
      price: priceavg,
      date_posted: latestdate,
    });
  }

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandable={{ expandedRowRender }}
      dataSource={fullportfolio}
    />
  );
}


export default Portfolio;