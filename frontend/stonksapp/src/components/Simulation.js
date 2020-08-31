import React from 'react';
import { List, Avatar, Input, Typography } from 'antd';

class Simulation extends React.Component {
    render() {
        return (
            <div>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 10,
                        showSizeChanger: false
                    }}
                    dataSource={this.props.data}
                    footer={
                        <div>
                            <b></b>
                        </div>
                    }
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                        >
                            <List.Item.Meta
                                title={<a href={`/simulations/${item.id}/`}>{item.created_at}</a>}
                                description={item.strategy}
                            />

                        </List.Item>
                    )
                    }
                />
            </div>
        )
    }

}

export default Simulation