import React from 'react';
import api from '../utils/api';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { Tabs } from 'antd';

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}
const Plot = createPlotlyComponent(Plotly);


class StocksDetail extends React.Component {
    state = {
        stock: {},
        most_recent: [],
        key: 'tab2',
        prices: [],
        stockChartXValues: [],
        stockChartYValues: [],
    }


    componentDidMount() {
        const symbol = this.props.match.params.stocksSymbol
        console.log(symbol)
        api.get(`/api/stocks/${symbol}/details/`)
            .then(res => {
                this.setState({
                    stock: res.data
                })
                console.log(res.data);
            })
        api.get(`/api/stocks/${symbol}/prices/most-recent/`)
            .then(res => {
                this.setState({
                    most_recent: res.data
                })
                console.log(res.data);
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
    };



    render() {
        return (
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="Overview" key="1">
                    {this.state.stock.description}
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

        );
    }
}

export default StocksDetail;