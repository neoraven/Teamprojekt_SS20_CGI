import React from 'react';
import { List, Avatar, Input, Typography } from 'antd';
import Price from './Price';
import api from '../utils/api';

const { Text } = Typography;

class Stocks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      displayname: '',
      latestPrice: [],
      lastDailyPrice: [],
      symbollist: [],
      batchprices: [],
      mostrecentbatchprices: [],
      stocks: [],

    }
  }
  loadNextPrice(firstten) {
    api.get(`/api/stocks/${this.state.symbollist}/prices/most-recent/?batch=true`)
      .then(res => {
        this.setState({
          mostrecentbatchprices: res.data
        })
      }).then(() => this.combinePricesIntoArray(firstten))
  }

  combinePricesIntoArray(firstten) {
    let temp = []
    console.log(this.state.batchprices)

    for (let stock of firstten) {
      for (let batchprice of this.state.batchprices) {
        if (stock.symbol === batchprice.symbol) {
          stock.lastDailyPrice = batchprice.p_close
          temp.push(stock)
        }
      }
    }
    console.log(temp)
    let temp2 = []
    for (let stock of temp) {
      for (let mostrecentbatchprice of this.state.mostrecentbatchprices) {
        if (stock.symbol === mostrecentbatchprice.symbol) {
          stock.most_recent = mostrecentbatchprice.p_close
          temp2.push(stock)
        }
      }
    }

    let stockscopy = []
    for (let stock of this.state.stocks) {
      for (let tempstock of temp2) {
        if (stock.symbol === tempstock.symbol) {
          stock = tempstock
          stockscopy.push(stock)
        }

      }
      if (!stockscopy.includes(stock)) {
        stockscopy.push(stock)
      }
    }
    this.setState({
      stocks: stockscopy
    })
  }

  loadPrices(page) {
    let end = page * 10
    let begin = end - 10

    let firstten = this.state.stocks.slice(begin, end)
    for (let stock of firstten) {
      this.state.symbollist.push(stock.symbol)
    }

    console.log(firstten)
    api.get(`/api/stocks/${this.state.symbollist}/prices/most-recent/?batch=true&interval=1d`)
      .then(res => {
        this.setState({
          batchprices: res.data
        })
      }).then(() => this.loadNextPrice(firstten))
  }

  componentDidMount() {
    this.setState({
      stocks: this.props.data
    }, () => this.loadPrices(1))
  }

  handleChange = (e) => {
    this.setState({
      searchString: e.target.value
    });
  }

  render() {
    var searchString = this.state.searchString.trim().toLowerCase();
    if (searchString.length > 0) {
      this.state.stocks = this.state.stocks.filter((stock) => {
        let displayname = stock.symbol + ", " + stock.company_name;
        return displayname.toLowerCase().match(searchString);
      })
    }
    if (this.state.stocks[0] != undefined) {
      return (
        <div>
          <Input
            type="text"
            placeholder="Search for stocks"
            value={this.state.searchString}
            onChange={this.handleChange}
          />
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
                this.loadPrices(page)
              },
              pageSize: 10,
            }}
            dataSource={this.state.stocks}
            footer={
              <div>
                <b></b>
              </div>
            }
            renderItem={item => (
              <List.Item
                key={item.symbol}
                extra={<Price symbol={item.symbol} latestDailyPrice={item.lastDailyPrice}
                  most_recent={item.most_recent} date={item.lastUpdated} />}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.meta_data.image_url} />}
                  title={
                    <a href={`/company/${item.symbol}`}>
                      {item.company_name}
                      <Text disabled >  [{item.symbol}]</Text>
                    </a>}
                  description={item.meta_data.description}
                />

              </List.Item>
            )
            }
          />
        </div>
      )
    } else {
      return (<div>No Stocks could be loaded</div>)
    }
  }
}

export default Stocks;
