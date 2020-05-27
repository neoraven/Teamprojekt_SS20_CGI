import { Select, InputNumber, Button } from 'antd';
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
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {

        for (let stock of this.props.stocks) {
            var combine = stock.company_name + '; (' + stock.symbol + ')'
            companys.push(combine);
            symbol.push(stock.symbol);
        }

        return (

            <form onSubmit={this.handleSubmit}>
                <Select
                    id="stock"
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


                <InputNumber
                    id="amount"
                    style={{ width: 200 }}
                    placeholder="Enter Amount to Buy/Sell"
                    min={1}
                    max={9999}
                />

                <Button type="primary" onClick={() => buy(1, 2)}>
                    Buy
                    </Button>

                <Button type="primary" danger onClick={() => sell(1, 2)}>
                    Sell
                    </Button>
            </form>

        );
    }
}
export default SelectStocks


