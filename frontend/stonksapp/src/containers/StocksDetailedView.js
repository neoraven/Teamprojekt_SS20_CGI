import React from 'react';
import axios from 'axios';
import { Card } from 'antd';

//UNUSED& UNFINISHEDba  

const tabList = [
  {
    key: 'tab1',
    tab: 'Overview',
  },
  {
    key: 'tab2',
    tab: 'Coole Daten',
  },
];

const contentList = {
  tab1: <p> </p>,
  tab2: <p>Not yet</p>,
};


class StocksDetail extends React.Component {
  state = {
    stock: {},
    prices: [],
    key: 'tab1',
  }
  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  componentDidMount() {
    const symbol = this.props.match.params.stocksSymbol
    console.log(symbol)
    axios.get(`http://127.0.0.1:8000/api/stocks/${symbol}`)
      .then(res => {
        this.setState({
          stock: res.data
        })
        console.log(res.data);
      })
    axios.get(`http://127.0.0.1:8000/api/stocks/${symbol}/prices/most-recent/`)
      .then(res => {
        this.setState({
          prices: res.data
        })
        console.log(res.data);
      })

  };

  render() {
    return (
      <div>
        <Card
          style={{ width: '100%' }}
          title={this.state.stock.company_name}
          extra={<a href={`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${this.state.stock.symbol}&action=getcompany`}>SEC Filings</a>}
          tabList={tabList}
          activeTabKey={this.state.key}
          onTabChange={key => {
            this.onTabChange(key, 'key');
          }}
        >
          This is the overview over the company {this.state.stock.company_name}. 
          It is trading under the symbol {this.state.stock.symbol} in the S&P 500.
          It is currently trading at a price of {this.state.prices.p_close}$ per share.
          {contentList[this.state.key]}
        </Card>
      </div>
    );
  }
}

export default StocksDetail;
