import React from 'react';
import { List, Avatar, Space } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import dummychart from '../dummychart.png';
import { Link } from 'react-router-dom';




const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);


const Stocks = (props) => {
  return(
    <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={props.data}
        footer={
          <div>
            <b></b> 
          </div>
        }
        renderItem={item => (
          <List.Item
            key={item.symbol}
            extra={
              <img
                width={272}
                height={150}
                alt="logo"
                src={dummychart}
              />
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item.meta_data.image_url} />}
              title={ <a href={`/company/${item.symbol}`}>{item.company_name}</a>}
              description={item.meta_data.description}
            />
        
          </List.Item>
        )}
      />
  )
}

export default Stocks;
