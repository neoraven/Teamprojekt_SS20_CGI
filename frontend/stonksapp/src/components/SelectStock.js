import {Button, Form, InputNumber, Select} from 'antd';
import React from 'react';
//import axios from 'axios';
import api from '../utils/api';

const {Option} = Select;

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


// TODO: Make the entire api request prettier/more compact/outsource them to another file
class SelectStocks extends React.Component {
    state = {
        stockval : {},
        stockamount : {}

    }

    onFinish = values => {
        var AuthStr = 'Token '.concat(localStorage.getItem('token'));

        var config = {
            headers: {'Authorization': AuthStr}
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
            headers: {'Authorization': AuthStr}
        };
        api.post('/api/portfolio/transaction/new/', {
            symbol: this.state.stockval,
            amount: (this.state.stockamount * (-1)),
        }, config)
        window.location.reload(true);//TODO: use state to make this prettier
      }

    onChange = values =>{
        if (values.stock === undefined){
            this.setState({
                stockamount: values.amount
            })
        }else{
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
                onValuesChange = {this.onChange}
            >
                <Form.Item
                    name="stock"
                    rules={[
                        {
                            required: true,
                            message: 'Please select a Stock to trade!',
                        },
                    ]}
                >
                    <Select //Trouble with multiple value entrys. not beautiful but works atm
                        showSearch
                        style={{width: 300}}
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
                        style={{width: 200}}
                        placeholder="Enter Amount to Buy/Sell"
                        min={1}
                        max={9999}
                    />
                
                </Form.Item>
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
            </Form>

        );
    }
}

export default SelectStocks


