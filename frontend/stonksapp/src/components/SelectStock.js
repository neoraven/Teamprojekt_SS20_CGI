import { Select, Input, Button } from 'antd';
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

const companys = [];
const symbol = [];
const SelectStocks = (props) => {
    for (let stock of props.stocks) {
        var combine = stock.company_name + '; (' + stock.symbol + ')'
        companys.push(combine);
        symbol.push(stock.symbol);
    }

    return (
        <table>
            <tr>
                <td>
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
                </td>

                <td>
                    <Input style={{ width: 200 }} placeholder="Enter Amount to Buy/Sell" />
                </td>
                <td>
                    <Button type="primary">
                        Buy
                    </Button>
                </td>
                <td>
                    <Button type="primary" danger>
                        Sell
                    </Button>
                </td>
            </tr>
        </table>
    );
}
export default SelectStocks


