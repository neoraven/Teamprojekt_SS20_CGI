import React from 'react';
import { List, Avatar, Input, Typography } from 'antd';

const creationdate = date => {
    return new Date(date).toDateString()
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

const geld = entry => {
    entry = formatter.format(entry)
    return entry
}

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
                                title={<a href={`/simulations/${item.id}/`}>Simulation from {`${creationdate(item.created_at)}`}</a>}
                                description={`Strategy: ${item.strategy}; Capital: ${geld(item.agent_starting_capital)}; Risk: ${item.preferences.risk_affinity}; Diversification: ${item.preferences.risk_affinity}; Capital Allocation: ${item.preferences.risk_affinity}`}
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