import React from 'react';
//import axios from 'axios';
import api from '../utils/api';
import { Card } from 'antd';
//import Plot from 'react-plotly.js';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);


class StocksDetail extends React.Component {
  state = {
    stock: {},
    most_recent: [],
    key: 'tab1',
    prices: [],
    stockChartXValues: [],
    stockChartYValues: [],
  }
  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  componentDidMount() {
    const symbol = this.props.match.params.stocksSymbol
    console.log(symbol)
    api.get(`/api/stocks/${symbol}/details/`)
      .then(res => {
        this.setState({
          stock: res.data
        })
        console.log(res.data);
      })
    api.get(`/api/stocks/${symbol}/prices/most-recent/`)
      .then(res => {
        this.setState({
          most_recent: res.data
        })
        console.log(res.data);
      })
    api.get(`/api/stocks/${symbol}/prices/all/`)
      .then(res => {
        this.setState({
          prices: res.data
        })
        this.state.prices.map(price => this.state.stockChartXValues.push(price.date))
        this.state.prices.map(price => this.state.stockChartYValues.push(price.p_adjusted_close))
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
      tab: 'Cool data',
    },
    {
      key: 'tab3',
      tab: 'Stock chart'
    }
  ];

  contentList = {
    tab1: <p>This is the overview of the company {this.state.stock.company_name}.
    It is trading under the symbol {this.state.stock.symbol} in the S&P 500.
    It is currently trading at a price of ${this.state.prices.p_close} per share.</p>,
    tab2: <p><p>Not yet</p><p><img width="50%" height="50%" src="https://cdn.vox-cdn.com/thumbor/_cPCJb9uJ3TN7qJQiIKxPjf50k0=/0x0:3173x2332/1200x800/filters:focal(1329x658:1835x1164)/cdn.vox-cdn.com/uploads/chorus_image/image/66150011/GettyImages_1173078245.0.jpg"></img></p></p>,
    tab3: <div>
      <Plot
        data={[
          {
            x: this.state.stockChartXValues,
            y: this.state.stockChartYValues,
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'blue' },
          }
        ]}
        layout={
          {
            autosize: true,
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