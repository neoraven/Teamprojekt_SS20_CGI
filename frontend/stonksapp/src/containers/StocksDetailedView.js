import React from 'react';
import api from '../utils/api';
import { Tabs, Descriptions } from 'antd';
import RealtimePrice from '../components/RealtimePrice';
import Chart from '../components/Chart/Chart';

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}


const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

const DescTable = (desc, industry, sector, ceo, website, sec, mcap, screensize) => {
    mcap = formatter.format(mcap)
    let tablesize = ""
    if (screensize < 500) {
        tablesize = "small"
        console.log("rerendered table")
    }
    return (
        <div>
            <Descriptions
                bordered
                size={tablesize}
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Industry" >{industry}</Descriptions.Item>
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
    constructor(props) {
        super(props);
        this.state = {
            stock: {},
            realtime: {},
            most_recent: {},
            key: 'tab2',
            prices: [],
            ohlc : [],
            volume : [],
            width: 0,
            height: 0,
        }
        this.updateWindowDimensions = this.updateWindowDimensions;
    }



    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
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
                    most_recent: res.data[0]
                })
            })
        api.get(`/api/stocks/${symbol}/prices/all/`)
            .then(res => {
                this.setState({
                    prices: res.data
                })
                console.log(this.state.prices)
                this.state.prices.map(price => {
                    price in this.state.ohlc ?
                        void (0)
                        :
                        this.state.ohlc.push([
                            new Date(price.date),
                            price.p_open,
                            price.p_high,
                            price.p_low,
                            price.p_close,
                        ])
                })
                this.state.prices.map(vol => {
                    vol in this.state.volume ?
                        void(0)
                        :
                        this.state.volume.push([
                            new Date(vol.date),
                            vol.volume
                        ])
                })
                this.setState({
                    chart :  <Chart ohlc={this.state.ohlc}
                                    volume={this.state.volume}
                                    stock={this.state.stock}
                    />
                })
                console.log(this.state.ohlc)
                console.log(this.state.volume)
            })
        api.get(`/api/stocks/${symbol}/prices/quote/`)
            .then(res => {
                this.setState({
                    realtime: res.data
                })
            })
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }



    render() {
        return (
            <div>
                <h1>{this.state.stock.company_name}</h1>
                <Tabs defaultActiveKey="1" onChange={callback}
                    tabBarExtraContent={<div style={{ marginLeft: 0 }}>
                        {this.state.most_recent != undefined && this.state.realtime != undefined ?
                            <RealtimePrice
                                price={this.state.realtime.p_close}
                                lastprice={this.state.most_recent.p_close}
                                date={this.state.most_recent.date}
                            />

                            :

                            <p> no prices found </p>

                        }


                    </div>}>
                    <TabPane tab="Overview" key="1">
                        {DescTable(this.state.stock.description, this.state.stock.industry,
                            this.state.stock.sector, this.state.stock.ceo,
                            this.state.stock.website_url, this.state.stock.symbol,
                            this.state.stock.market_cap, this.state.width)}
                    </TabPane>
                    <TabPane tab="Chart" key="2">
                        {this.state.chart}
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default StocksDetail;