import React from 'react';
import { List, Avatar, Input, Typography } from 'antd';
import Price from './Price';
import api from '../utils/api';

const { Text } = Typography;
let once = 0;

class Stocks extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    searchString: '',
    displayname: '',
    latestPrice: [],
    lastDailyPrice: [],
    symbollist: [],
    batchprices: [],
    mostrecentbatchprices: [],

  }

  componentDidMount() {
    console.log(this.props.data)
    //WHY IS THIS^ F.... EMPTY
  }

  handleChange = (e) => {
    this.setState({
      searchString: e.target.value
    });
  }

  render() {
    var stocks = this.props.data,
      searchString = this.state.searchString.trim().toLowerCase();
    if (searchString.length > 0) {
      stocks = stocks.filter((stock) => {
        let displayname = stock.symbol + ", " + stock.company_name;
        return displayname.toLowerCase().match(searchString);
      })
    }
//*************Begin: Hacky implementation of Batch endpoint****************/
    for (let stock of stocks) {
      console.log(stock.symbol)
      this.state.symbollist.push(stock.symbol)

      if(this.state.symbollist.length % 10 == 0){
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
        }
    
        console.log("-------------------------------------------------------------")
        console.log("Render Called")
        console.log(stocks)
        console.log("-------------------------------------------------------------")
      }
    }
    


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
          dataSource={stocks} //-> Maybe make stocks its own component to maybe make the prices comps work
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
