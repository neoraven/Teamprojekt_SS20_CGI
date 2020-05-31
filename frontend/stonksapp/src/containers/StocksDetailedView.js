import React from 'react';
import axios from 'axios';
import { Card } from 'antd';
import Plot from 'react-plotly.js';

//UNUSED& UNFINISHEDba  

class StocksDetail extends React.Component {
  state = {
    stock: {},
    most_recent: [],
    key: 'tab1',
    prices : [],
    stockChartXValues : [],
    stockChartYValues : [],
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
          most_recent: res.data
        })
        console.log(res.data);
      })
    axios.get(`http://127.0.0.1:8000/api/stocks/${symbol}/prices/all/`)
      .then(res => {
        this.setState({
          prices : res.data
        }) 
      this.state.prices.map(price => this.state.stockChartXValues.push(price.date))
      this.state.prices.map(price => this.state.stockChartYValues.push(price.p_open))
      console.log(this.state.stockChartXValues)
      console.log(this.state.stockChartYValues)
      })
  };

  tabList = [
    {
      key: 'tab1',
      tab: 'Overview',
    },
    {
      key: 'tab2',
      tab: 'Coole Daten',
    },
    {
      key: 'tab3',
      tab: 'Aktienchart'
    }
  ];
  
  contentList = {
    tab1: <p>This is the overview of the company {this.state.stock.company_name}.
    It is trading under the symbol {this.state.stock.symbol} in the S&P 500.
    It is currently trading at a price of ${this.state.prices.p_close} per share.</p>,
    tab2: <p>Not yet</p>,
    tab3: <div>
    <Plot
      data={[
        {
          x: this.state.stockChartXValues,
          y: this.state.stockChartYValues,
          type: 'scatter',
          mode: 'lines',
          marker: {color: 'blue'},
        }
      ]}
      layout={
        {
         autosize : true,
         margin : {
              t : 0, 
              l : 0,
              r : 0,
              b : 0, 
         }
        }
      }
    />
  </div>
  };

  render() {
    return (
      <div>
        <Card
          style={{ width: '100%' }}
          title={this.state.stock.company_name}
          extra={<a href={`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${this.state.stock.symbol}&action=getcompany`}>SEC Filings</a>}
          tabList={this.tabList}
          activeTabKey={this.state.key}
          onTabChange={key => {
            this.onTabChange(key, 'key');
          }}
        >
          {this.contentList[this.state.key]}
        </Card>
      </div>
    );
  }
}

export default StocksDetail;
