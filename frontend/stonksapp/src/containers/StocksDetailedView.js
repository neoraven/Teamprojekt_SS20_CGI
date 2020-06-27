import React from 'react';
import api from '../utils/api';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { Tabs, Popover, Statistic, Row, Col, Descriptions } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import Price from '../components/Price';

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}
const Plot = createPlotlyComponent(Plotly);


const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

const DescTable = (desc, industry, sector, ceo, website, sec, mcap) => {
    mcap = formatter.format(mcap)
    return (
        <div>
            <Descriptions
                bordered
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Industry">{industry}</Descriptions.Item>
                <Descriptions.Item label="Sector">{sector}</Descriptions.Item>
                <Descriptions.Item label="CEO">{ceo}</Descriptions.Item>
                <Descriptions.Item label="Website"><a href={website} >{website}</a></Descriptions.Item>
                <Descriptions.Item label="SEC Filings"><a href={`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${sec}&action=getcompany`}> SEC files </a></Descriptions.Item>
                <Descriptions.Item label="Market Capitalization">{mcap}</Descriptions.Item>
                <Descriptions.Item label="Company description">
                    {desc}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
};


class StocksDetail extends React.Component {
    state = {
        stock: {},
        realtime: {},
        most_recent: [],
        key: 'tab2',
        prices: [],
        stockChartXValues: [],
        stockChartYValues: [],
    }


    componentDidMount() {
        var AuthStr = 'Token '.concat(localStorage.getItem('token'));

        var config = {
            headers: { 'Authorization': AuthStr }
        };
        const symbol = this.props.match.params.stocksSymbol
        console.log(symbol)
        api.get(`/api/stocks/${symbol}/details/`)
            .then(res => {
                this.setState({
                    stock: res.data
                })
            })
        api.get(`/api/stocks/${symbol}/prices/most-recent/?interval=1d`)
            .then(res => {
                this.setState({
                    most_recent: res.data
                })
            })
        api.get(`/api/stocks/${symbol}/prices/all/`)
            .then(res => {
                this.setState({
                    prices: res.data
                })
                this.state.prices.map(price => this.state.stockChartXValues.push(price.date))
                this.state.prices.map(price => this.state.stockChartYValues.push(price.p_close))
                console.log(this.state.stockChartXValues)
                console.log(this.state.stockChartYValues)
            })
        api.get(`/api/stocks/${symbol}/prices/quote/`, config)
            .then(res => {
                this.setState({
                    realtime: res.data
                })
            })
    };




    render() {
        //<a href={`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${this.state.stock.symbol}&action=getcompany`}> SEC files </a>
        //this.state.realtime.p_close -- add into price later, removed while debugging
        return (
            <div>
                <h1>{this.state.stock.company_name}</h1>
                <Tabs defaultActiveKey="1" onChange={callback} tabBarExtraContent={<Price price = {this.state.realtime.p_close} lastprice= {this.state.most_recent}/>}>
                    <TabPane tab="Overview" key="1">
                        {DescTable(this.state.stock.description, this.state.stock.industry,
                            this.state.stock.sector, this.state.stock.ceo,
                            this.state.stock.website_url, this.state.stock.symbol,
                            this.state.stock.market_cap)}
                    </TabPane>
                    <TabPane tab="Chart" key="2">
                        <Plot
                            data={[
                                {
                                    x: this.state.stockChartXValues,
                                    y: this.state.stockChartYValues,
                                    type: 'scatter',
                                    mode: 'lines',
                                    marker: { color: 'blue' },
                                }
                            ]}
                            layout={
                                {
                                    autosize: true,
                                }
                            }
                        />
                    </TabPane>
                    <TabPane tab="Dividend History" key="3">
                        <img width="50%" height="50%" src="https://cdn.vox-cdn.com/thumbor/_cPCJb9uJ3TN7qJQiIKxPjf50k0=/0x0:3173x2332/1200x800/filters:focal(1329x658:1835x1164)/cdn.vox-cdn.com/uploads/chorus_image/image/66150011/GettyImages_1173078245.0.jpg"></img>
                    </TabPane>
                </Tabs>
            </div>

        );
    }
}

export default StocksDetail;