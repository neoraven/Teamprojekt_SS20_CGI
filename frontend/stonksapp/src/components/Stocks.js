import React from 'react';
import { List, Avatar, Input, Typography } from 'antd';
import Price from './Price';
import api from '../utils/api';

const { Text } = Typography;
let once = 0;

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

 /* loadPrices(page) {
    let end = page * 10
    let begin = end - 10

    let firstten = this.state.stocks.slice(begin, end)
    let fullstocks = this.state.stocks


    api.get(`/api/stocks/${firstten}/prices/most-recent/?batch=true&interval=1d`)
      .then(res => {
        this.setState({
          batchprices: res.data
        })
      })
    api.get(`/api/stocks/${firstten}/prices/most-recent/?batch=true`)
      .then(res => {
        this.setState({
          mostrecentbatchprices: res.data
        })
      })


      let temp = []
      for(let stock of firstten){
        for(let batchprice of this.state.batchprices){
          if(stock.symbol === batchprice.symbol){
            stock.lastDailyPrice = batchprice.p_close
            temp.push(stock)
          }
        }
      }
      let temp2 = []
      for(let stock of temp){
        for(let mostrecentbatchprice of this.state.mostrecentbatchprices){
          if(stock.symbol === mostrecentbatchprice.symbol){
            stock.most_recent = mostrecentbatchprice.p_close
            temp2.push(stock)
          }
        }
      }
      
      let stockscopy = []
      for(let stock of this.state.stocks){
        for(let tempstock of temp2){
          if(stock.symbol === tempstock.symbol){
            stock = tempstock
            stockscopy.push(stock)
          }
        }

      }
      this.setState({
        stocks = stockscopy
      })

  }*/

  componentDidMount() {
    console.log("-------------------------------------------------------------")
    console.log(this.props.data)
    console.log("-------------------------------------------------------------")
    this.setState({
      stocks: this.props.data
    })


    /* //WORK IN PROGRESS


    let firstten = this.state.stocks.slice(0,10)

    api.get(`/api/stocks/${firstten}/prices/most-recent/?batch=true&interval=1d`)
      .then(res => {
        this.setState({
          batchprices: res.data
        })
      })
    api.get(`/api/stocks/${firstten}/prices/most-recent/?batch=true`)
      .then(res => {
        this.setState({
          mostrecentbatchprices: res.data
        })
      })

    for(let stock of stocks){
      for(let batchprice of this.state.batchprices){
        if(stock.symbol === batchprice.symbol){
          stock.latestPrice = batchprice.p_close
        }
      }
    }
    this.setState({
      stocks: stocks
    })*/
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
    //*************Begin: Hacky implementation of Batch endpoint****************/
    /* var stocks = this.state.stocks
        for (let stock of stocks) {
          this.state.symbollist.push(stock.symbol)
        }
        
    
        if (once < 2) {
          api.get(`/api/stocks/${this.state.symbollist}/prices/most-recent/?batch=true&interval=1d`)
            .then(res => {
              this.setState({
                batchprices: res.data
              })
            })
          api.get(`/api/stocks/${this.state.symbollist}/prices/most-recent/?batch=true`)
            .then(res => {
              this.setState({
                mostrecentbatchprices: res.data
              })
            })
          once++;
        }
    
        for (let batchprice of this.state.batchprices) {
          for (let stock of stocks) {
          if (batchprice.symbol == stock.symbol) {
            stock.latestDailyPrice = batchprice.p_close
            stock.lastUpdated = batchprice.date
          }
          }
        }
        for (let mostrecentbatchprice of this.state.mostrecentbatchprices) {
          for (let stock of stocks) {
          if (mostrecentbatchprice.symbol == stock.symbol) {
            stock.most_recent = mostrecentbatchprice.p_close
          }
          }
        }*/
    //*************End: Hacky implementation of Batch endpoint****************/
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
            },
            pageSize: 10,
          }}
          dataSource={this.state.stocks} //-> Maybe make stocks its own component to maybe make the prices comps work
          footer={
            <div>
              <b></b>
            </div>
          }
          renderItem={item => (
            <List.Item
              key={item.symbol}
              extra={<Price symbol={item.symbol} latestDailyPrice={item.latestDailyPrice}
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
  }
}

export default Stocks;
