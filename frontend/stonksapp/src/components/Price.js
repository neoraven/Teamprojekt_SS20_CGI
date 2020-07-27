import React from 'react';
import { Popover, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import api from '../utils/api';


class Price extends React.Component {
    state = {
        most_recent: [],
        latestDailyPrice: [],
    }

    componentDidMount() {
        console.log(this.props)
        this.setState.most_recent = this.props.most_recent
        this.setState.latestDailyPrice = this.props.latestDailyPrice
       /* api.get(`/api/stocks/${this.props.symbol}/prices/most-recent/`) //prices are now coming from the batch endpoint in stocks.js
            .then(res => {
                this.setState({
                    most_recent: res.data[0]
                })
            })
        api.get(`/api/stocks/${this.props.symbol}/prices/most-recent/?interval=1d`)
            .then(res => {
                this.setState({
                    latestDailyPrice: res.data[0]
                })
            })*/
    }

    render() {
        if (this.state.latestDailyPrice == undefined || this.state.most_recent == undefined){
            return <p>No prices found</p>
        }
            
        //let change = this.state.most_recent.p_close / this.state.latestDailyPrice.p_close; //this is the old one that was used with the api calls
        let change = this.props.most_recent / this.props.latestDailyPrice;
        //console.log(this.state.latestDailyPrice)
        if (change < 1) {
            change = (1 - change) * 100;
            return (
                <div className="site-statistic-demo-card" >
                    <Popover content={this.props.date} title="Date of last close">
                        <Row gutter={25}>
                            <Col span={12}>
                                <Statistic
                                    title="Price"
                                    value={this.props.most_recent}
                                    precision={2}
                                    valueStyle={{ color: '#cf1322', fontSize: '17px' }}
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
                                    valueStyle={{ color: '#cf1322', fontSize: '17px' }}
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
                    <Popover content={this.props.date} title="Date of last close">
                        <Row gutter={25}>
                            <Col span={12}>
                                <Statistic
                                    title="Price"
                                    value={this.props.most_recent}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600', fontSize: '17px' }}
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
                                    valueStyle={{ color: '#3f8600', fontSize: '17px' }}
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
}

export default Price
