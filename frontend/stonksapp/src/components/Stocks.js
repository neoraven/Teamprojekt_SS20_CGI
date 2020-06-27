import React from 'react';
import { List, Avatar, Input } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, AntDesignOutlined } from '@ant-design/icons';
import dummychart from '../dummychart.png';
import { Link } from 'react-router-dom';
import { Tabs, Popover, Statistic, Row, Col, Descriptions } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import api from '../utils/api';

const Price = (price, lastprice) => {
  let change = price / lastprice.p_adjusted_close;
  console.log(change, price, lastprice.p_close);
  if (change < 1) {
    change = (1 - change) * 100;
    return (
      <div className="site-statistic-demo-card" >
        <Popover content={lastprice.date} title="Date of last close">
          <Row gutter={25}>
            <Col span={12}>
              <Statistic
                title="Price"
                value={price}
                precision={2}
                valueStyle={{ color: '#cf1322', fontSize: '18px' }}
                prefix={<ArrowDownOutlined />}
                suffix="$"
                style={{ width: '120%', height: '10%', fontSize: '5px', marginLeft: '-15%' }}
              />
            </Col>
            <Col span={12} >
              <Statistic
                title="Change %"
                value={-change}
                precision={2}
                valueStyle={{ color: '#cf1322', fontSize: '18px' }}
                prefix={<ArrowDownOutlined />}
                suffix="%"
                style={{ width: '120%', height: '10%', fontSize: '5px', marginLeft: '-15%' }}
              />
            </Col>
          </Row>
        </Popover>
      </div>
    );
  } else {
    change = (change - 1) * 100;
    return (
      <div className="site-statistic-demo-card" >
        <Popover content={lastprice.date} title="Date of last close">
          <Row gutter={25}>
            <Col span={12}>
              <Statistic
                title="Price"
                value={price}
                precision={2}
                valueStyle={{ color: '#3f8600', fontSize: '18px' }}
                prefix={<ArrowUpOutlined />}
                suffix="$"
                style={{ width: '120%', height: '10%', fontSize: '5px', marginLeft: '-15%' }}
              />
            </Col>
            <Col span={12} >
              <Statistic
                title="Change %"
                value={change}
                precision={2}
                valueStyle={{ color: '#3f8600', fontSize: '18px' }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
                style={{ width: '120%', height: '10%', fontSize: '5px', marginLeft: '-15%' }}
              />
            </Col>
          </Row>
        </Popover>
      </div>
    );
  }


}


class Stocks extends React.Component {

  state = {
    searchString: '',
    displayname: '',
    latestPrice: [],
    lastDailyPrice: [],

  }

  componentDidMount() {
    console.log(this.props)
    api.get(`/api/stocks/${this.props.data.symbol}/prices/most-recent/`)
      .then(res => {
        this.setState({
          latestPrice: res.data
        })
      })
    api.get(`/api/stocks/${this.props.data.symbol}/prices/most-recent/?interval=1d`)
      .then(res => {
        this.setState({
          lastDailyPrice: res.data
        })
      })
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
              extra={Price(this.state.latestPrice.p_close, this.state.lastDailyPrice)}
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
