import React from 'react'
import api from '../utils/api';

import { List, Avatar, Button } from 'antd';

const companyicon = entry => {
 /*  const data = []
    api.get(`/api/stocks/${entry}/details/`)
        .then(res => {
            data.push(res)
        })
    console.log(data)
    return <Avatar src={data.meta_data.image_url} />*/
}

class RecommendationsTable extends React.Component {
    state = {
        recs: [],
        details: [],
        symbols: []
    }

    componentDidMount() {

    }

    render() {
        if (this.props.data != undefined) {

            return (
                <List
                    itemLayout="horizontal"
                    dataSource={this.props.data}
                    renderItem={item => (
                        <List.Item
                            actions={[<Button type="primary" > Add to Portfolio </Button>]}>

                            <List.Item.Meta
                                avatar={companyicon(item.symbol)}
                                title={<a href="https://ant.design">{item.symbol}</a>}
                            />
                            <div>{item.weight}</div>
                        </List.Item>
                    )}
                />
            )
        }
    }
}

export default RecommendationsTable