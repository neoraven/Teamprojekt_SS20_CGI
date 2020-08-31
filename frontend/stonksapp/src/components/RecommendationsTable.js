import React from 'react'
import api from '../utils/api';

import { List, Avatar, Button } from 'antd';

const companyicon = entry => {
    /*let data = []
    api.get(`/api/stocks/${entry}/details/`)
        .then(res => {
            data.push(res)
        })
    console.log(data)
    return <Avatar src={data[0].image_url} />*/
}

const weights = entry =>{
    entry = entry *100
    var roundedString = entry.toFixed(2);
    return roundedString
}

class RecommendationsTable extends React.Component {
    state = {
        recs: [],
        details: [],
        symbols: []
    }

    componentDidMount() {
        console.log(this.props.data)
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
                                title={<a href={`/company/${item.symbol}/`}>{item.symbol}</a>}
                            />
                            <div>{weights(item.weight)} %</div>
                        </List.Item>
                    )}
                />
            )
        }
    }
}

export default RecommendationsTable