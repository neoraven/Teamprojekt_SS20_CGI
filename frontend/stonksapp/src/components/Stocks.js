import React from 'react';
import { List, Avatar, Input } from 'antd';
import Price from './Price';

class Stocks extends React.Component {
  constructor(props){
    super(props);
  }

  state = {
    searchString: '',
    displayname: '',
    latestPrice: [],
    lastDailyPrice: [],

  }

componentDidMount(){
  console.log(this.props.data)
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
            pageSize: 3,
          }}
          dataSource={stocks}
          footer={
            <div>
              <b></b>
            </div>
          }
          renderItem={item => (
            <List.Item
              key={item.symbol}
              extra={<Price symbol ={item.symbol}/>}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.meta_data.image_url} />}
                title={<a href={`/company/${item.symbol}`}>{item.company_name}</a>}
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
