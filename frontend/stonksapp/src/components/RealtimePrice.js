import React from 'react';
import { Popover, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './RealtimePrice.css';


class RealtimePrice extends React.Component {
    state = {
        most_recent: [],
        latestDailyPrice: [],
    }
//https://stackoverflow.com/questions/40877053/use-if-else-to-declare-a-let-or-const-to-use-after-the-if-else
// try implementing this solution to make this way less redundant code
    render() {
        let lprice = this.props.lastprice
        let change = this.props.price / lprice;
        console.log(change)
        console.log(this.props.price)
        console.log(lprice)
        if (change < 1) {
            change = (1 - change) * 100;
            return (
                <div className="price-card" >
                    <Popover content="a" title="Date of last close">
                        <Row gutter={25} >
                            <Col span={12}>
                                <Statistic
                                    title="Price"
                                    value={this.props.price}
                                    precision={2}
                                    valueStyle={{ color: '#cf1322', fontSize: '16px' }}
                                    prefix={<ArrowDownOutlined />}
                                    suffix="$"
                                    style={{ width: '120%', height: '10%', marginLeft: '-15%'}}
                                />
                            </Col>
                            <Col span={12} >
                                <Statistic
                                    title="Change %"
                                    value={-change}
                                    precision={2}
                                    valueStyle={{ color: '#cf1322', fontSize: '16px' }}
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
                <div className="price-card" >
                    <Popover content="a" title="Date of last close">
                        <Row gutter={25}>
                            <Col span={12}>
                                <Statistic
                                    title="Price"
                                    value={this.props.price}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600', fontSize: '16px' }}
                                    prefix={<ArrowUpOutlined />}
                                    suffix="$"
                                    style={{ width: '120%', height: '10%',  marginLeft: '-15%' }}
                                />
                            </Col>
                            <Col span={12} >
                                <Statistic
                                    title="Change %"
                                    value={change}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600', fontSize: '16px' }}
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

export default RealtimePrice
