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
      symbollist: [],
      lastdayscloseprices: [],
      mostrecentprices: [],
      stocks: [],
      stocks_constant: [],
    }
  }


  componentDidMount() {
    this.setState({
      stocks: this.props.data,
      stocks_constant: this.props.data
    }, () => this.loadPrices(1))
  }

  loadPrices(page, searchstocks) {
    let stocksonpage = []
    if (page != 0){
    let end = page * 10
    let begin = end - 10

    stocksonpage = this.state.stocks.slice(begin, end)
    } else{
      stocksonpage = searchstocks
    }

    for (let stock of stocksonpage) {
      this.state.symbollist.push(stock.symbol)
    }

    api.get(`/api/stocks/${this.state.symbollist}/prices/most-recent/?batch=true&interval=1d`)
      .then(res => {
        this.setState({
          lastdayscloseprices: res.data
        })
      }).then(() => this.loadNextPrice(stocksonpage))
  }

  loadNextPrice(stocksonpage) {
    api.get(`/api/stocks/${this.state.symbollist}/prices/most-recent/?batch=true`)
      .then(res => {
        this.setState({
          mostrecentprices: res.data
        })
      }).then(() => this.combinePricesIntoArray(stocksonpage))
  }

  combinePricesIntoArray(stocksonpage) {

    let temp = []
    for (let stock of stocksonpage) {
      for (let price of this.state.lastdayscloseprices) {
        if (stock.symbol === price.symbol) {
          stock.lastdayscloseprice = price.p_close
          stock.dateoflastclose = price.date
          temp.push(stock)
        }
      }
    }
    console.log(temp)
    let temp2 = []
    for (let stock of temp) {
      for (let price of this.state.mostrecentprices) {
        if (stock.symbol === price.symbol) {
          stock.most_recent = price.p_close
          temp2.push(stock)
        }
      }
    }

    let stockscopy = []
    for (let stock of this.state.stocks_constant) {
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
      stocks: stockscopy,
      symbollist: [], //reset of symbollist so it does not bigger than ten while loading new pages
      stocks_constant: stockscopy //this.state.stock gets changed during the search. thats why we need a constant copy for the original stocks
    })
  }

  handleChange = (e) => {
    console.log(e.target)
    if (e.target.value == "") {
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
      this.setState({
        searchString: e.target.value
      });
      this.state.stocks = this.state.stocks_constant
    } else {
      this.setState({
        searchString: e.target.value
      }, () => this.loadPricesOnSearch());
    }
  }

  loadPricesOnSearch() {
    var searchString = this.state.searchString.trim().toLowerCase();
    this.state.stocks = this.state.stocks_constant.filter((stock) => {
      let displayname = stock.symbol + ", " + stock.company_name;
      return displayname.toLowerCase().match(searchString);
    })
    if (this.state.stocks.length <= 10 && this.state.stocks[0] != undefined) {
      this.loadPrices(0, this.state.stocks)
    }
  }

 



  render() {
    var searchString = this.state.searchString.trim().toLowerCase();
    if (searchString.length > 0) {
      console.log("IN SEARCH")
      this.state.stocks = this.state.stocks_constant.filter((stock) => {
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
              showSizeChanger: false
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
                extra={<Price symbol={item.symbol} latestDailyPrice={item.lastdayscloseprice}
                  most_recent={item.most_recent} date={item.dateoflastclose} />}
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
      return (<div>
        <Input
          type="text"
          placeholder="Search for stocks"
          value={this.state.searchString}
          onChange={this.handleChange}
        />


        No Stocks could be loaded</div>)
    }
  }
}

export default Stocks;
