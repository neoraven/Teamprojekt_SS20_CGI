import React from 'react';
import { List, Avatar, Input} from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, AntDesignOutlined } from '@ant-design/icons';
import dummychart from '../dummychart.png';
import { Link } from 'react-router-dom'; 

class Stocks extends React.Component {

  state = { searchString: ''}
  handleChange = (e) => {
    this.setState({
      searchString : e.target.value
    });
  }

  render() {

    var stocks = this.props.data,
        searchString = this.state.searchString.trim().toLowerCase();
    if (searchString.length > 0) {
      stocks = stocks.filter((stock) => {
          return stock.company_name.toLowerCase().match(searchString);
      })
    }
    
    return(
      <div>
        <Input
          type="text"
          placeholder = "Search for stocks"
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
            renderItem={item=> (
              <List.Item
                key={item.symbol}
                /*extra={
                  <img
                    width={272}
                    height={150}
                    alt="logo"
                    src={dummychart}
                  />
                }*/
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.meta_data.image_url} />}
                  title={ <a href={`/company/${item.symbol}`}>{item.company_name}</a>}
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
