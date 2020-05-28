import { Select, InputNumber, Button, Form } from 'antd';
import React from 'react';

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

function buy(stock, amount) {
    console.log(stock)
}
function sell() {
    console.log('sell')
}


const companys = [];

const symbol = [];

class SelectStocks extends React.Component {
    onFinish = values => {
       console.log(values.stock, values.amount)
    };

    render() {

        for (let stock of this.props.stocks) {
            var combine = stock.company_name + '; (' + stock.symbol + ')'
            companys.push(combine);
            symbol.push(stock.symbol);
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
                    {companys.map(item => (
                        <Option key={item} value={item} label={item}>
                            {item}
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
            <Form.Item>
                <Button type="primary" htmlType="submit" >
                    Buy
                </Button>
            </Form.Item>
            <Form.Item>
                <Button type="primary" danger htmlType="submit">
                    Sell
                </Button>
            </Form.Item>
            </Form>

        );
    }
}
export default SelectStocks


