import { Select, InputNumber, Button, Form } from 'antd';
import React from 'react';
import axios from 'axios'

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

var AuthStr = 'Token '.concat(localStorage.getItem('token'));

var config = {
    headers: { 'Authorization': AuthStr }
};
// to identify buttons: https://stackoverflow.com/questions/3577469/form-onsubmit-determine-which-submit-button-was-pressed
class SelectStocks extends React.Component {
    onFinish = values => {
        console.log(values.stock, values.amount, values.buy, values.sell)
        console.log(config)
        axios.post('http://127.0.0.1:8000/api/portfolio/transaction/new/', config, { //Authfail, why?
            symbol: values.stock,
            amount: values.amount,
        })
    };

    render() {

        for (let stock of this.props.stocks) {
            var combine = stock.company_name + '; (' + stock.symbol + ')'
            comp.push({
                company_name: stock.company_name.toString(),
                symbol: stock.symbol.toString(),
                displayname: combine.toString(),
            })
        }

        return (

            <Form
                name="input_order"
                className="order-form"
                layout="inline"
                initialValues={{
                    remember: true,
                }}
                onFinish={this.onFinish}
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
                        {comp.map(item => (
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
                        style={{ width: 200 }}
                        placeholder="Enter Amount to Buy/Sell"
                        min={1}
                        max={9999}
                    />
                </Form.Item>
                <Form.Item name="buy">
                    <Button type="primary" htmlType="submit" >
                        Buy
                </Button>
                </Form.Item>
                <Form.Item name="sell">
                    <Button type="primary" danger htmlType="submit">
                        Sell
                </Button>
                </Form.Item>
            </Form>

        );
    }
}
export default SelectStocks


