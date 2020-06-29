import { Button, Form, InputNumber, Select, notification, Col, Row, Typography } from 'antd';
import React from 'react';
//import axios from 'axios';
import api from '../utils/api';

const {Text, Link} = Typography;

const { Option } = Select;

function onChange(value) {
    console.log(`selected ${value}`);
}

function onBlur() {
    console.log('blur');
}

function onFocus() {
    console.log('focus');
}

function onSearch(val) {
    console.log('search:', val);
}

const comp = [{
    company_name: "",
    symbol: "",
    displayname: "",
}]

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})


// TODO: Make the entire api request prettier/more compact/outsource them to another file
class SelectStocks extends React.Component {
    state = {
        stockval: {},
        stockamount: {},
        price: {},
        marketvalue: [],
    }

    onFinish = values => {
        var AuthStr = 'Token '.concat(localStorage.getItem('token'));

        var config = {
            headers: { 'Authorization': AuthStr }
        };
        api.post('/api/portfolio/transaction/new/', {
            symbol: values.stock,
            amount: values.amount,
        }, config)

        console.log(values)

        window.location.reload(true); //TODO: use state to make this prettier

    };

    handleAlternate(event) {
        event.preventDefault();
        var AuthStr = 'Token '.concat(localStorage.getItem('token'));

        var config = {
            headers: { 'Authorization': AuthStr }
        };

        let amount_sum = 0
        for (let transaction of this.props.transactions) {
            if (transaction.symbol === this.state.stockval) {
                amount_sum += transaction.amount
            }
        }
        if (amount_sum < this.state.stockamount) {
            notification.open({
                message: 'Selling failed',
                description:
                    'Looks like the amount of the stock you want to sell is too high. Please enter a valid amount.',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
        } else {
            api.post('/api/portfolio/transaction/new/', {
                symbol: this.state.stockval,
                amount: (this.state.stockamount * (-1)),
            }, config)
            window.location.reload(true);
        }
    }

    onChange = values => {
        if (values.stock === undefined) {
            this.setState({
                stockamount: values.amount,
                marketvalue: formatter.format(this.state.price.p_close * values.amount)
            })
        } else {
            var AuthStr = 'Token '.concat(localStorage.getItem('token'));

            var config = {
                headers: { 'Authorization': AuthStr }
            };
            api.get(`/api/stocks/${values.stock}/prices/quote/`, config)
                .then(res => {
                    this.setState({
                        price: res.data
                    })
                })
            this.setState({
                stockval: values.stock
            })
        }

    }

    render() {
        return (

            <Form
                name="input_order"
                className="order-form"
                layout="inline"
                initialValues={{
                    remember: true,
                }}
                onFinish={this.onFinish}
                onValuesChange={this.onChange}
            >

                <Row>
                    <Col >
                        <Form.Item
                            name="stock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a Stock to trade!',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                style={{ width: 300 }}
                                placeholder="Select a Stock"
                                optionFilterProp="children"
                                onChange={onChange}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.props.stocks.map(item => (
                                    <Option key={item.symbol} value={item.symbol} label={item.company_name}>
                                        {item.displayname}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Row>
                            <Form.Item name='Price'>
                                {
                                    this.state.price.p_close == undefined ?

                                    <Text disabled >Price per share: ${this.state.price.p_close}</Text>

                                    :

                                    <Text >Price per share: ${this.state.price.p_close}</Text>
                                }
                                
                                
                            </Form.Item>
                        </Row>
                    </Col>
                    <Col>
                        <Form.Item
                            name="amount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter an Amount!',
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: 200 }}
                                placeholder="Enter Amount to Buy/Sell"
                                min={0}
                                max={9999}
                            />

                        </Form.Item>
                        <Row>
                            <Form.Item name='MarketValue'>
                                {
                                    this.state.marketvalue == 0 ?

                                    <Text disabled>Total value: ${this.state.marketvalue}</Text>

                                    :

                                    <Text >Total value: {this.state.marketvalue}</Text>

                                }
                                
                            </Form.Item>
                        </Row>
                    </Col>
                    <Form.Item name="buy">
                        <Button type="primary" htmlType="submit">
                            Buy
                    </Button>
                    </Form.Item>
                    <Form.Item name="sell">
                        <Button type="primary" danger onClick={this.handleAlternate.bind(this)} >
                            Sell
                    </Button>
                    </Form.Item>

                </Row>





            </Form>

        );
    }
}

export default SelectStocks


