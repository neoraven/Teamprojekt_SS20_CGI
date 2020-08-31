import React from 'react'
import api from '../utils/api';

import { List, Avatar, Button } from 'antd';

const companyicon = entry => {
      

}

    function getprices(symbol, weight, capital){
        api.get(`/api/stocks/${symbol}/prices/most-recent/`)
        .then(res => {
            addtoportfolio(symbol, weight, capital, res.data[0].p_close)
        })
    }

    function addtoportfolio(symbol, weight, capital, price){
        var cashforstock = weight * capital
        var amountofstock = cashforstock/price

        
        amountofstock = Math.floor(amountofstock)

        console.log("stockprice "+ price + " cash for stock: "+ cashforstock + " amount to buy: "+ amountofstock)


        api.post('/api/portfolio/transaction/new/', {
            symbol: symbol,
            amount: amountofstock,
        })
    }


function weights(entry, capital, symbol) {
    entry = entry * 100
    var roundedString = entry.toFixed(2);
    console.log(capital)
    return roundedString
}

function second(entry, capital, price) {
    let stockcount = capital * entry
    var roundedAmountOfCapitalForStock = stockcount.toFixed(0);
    var amountOfStocks = roundedAmountOfCapitalForStock / price
    amountOfStocks = amountOfStocks.toFixed(0)
    console.log("amoun" + amountOfStocks)
    console.log("capital" + roundedAmountOfCapitalForStock)
    console.log("stockprice" + price)

    entry = entry * 100
    var roundedString = entry.toFixed(2);
    console.log(capital)
    return roundedString
}

class RecommendationsTable extends React.Component {
    state = {
        recs: [],
        details: [],
        symbols: [],
        mostrecentprice: [],
    }

    componentDidMount() {
        console.log(this.props.data)

    }

    test(symbol, weight, capital){
        getprices(symbol, weight, capital)
    }
    

    render() {
        if (this.props.data != undefined) {

            return (
                <List
                    itemLayout="horizontal"
                    dataSource={this.props.data}
                    renderItem={item => (
                        <List.Item
                            actions={[<Button type="primary" onClick={() => this.test(item.symbol, item.weight, this.props.capital)} > Add to Portfolio </Button>]}>
                            <List.Item.Meta
                                avatar={companyicon(item.symbol)}
                                title={<a href={`/company/${item.symbol}/`}>{item.symbol}</a>}
                            />
                            <div>{weights(item.weight, this.props.capital, item.symbol)} %</div>
                        </List.Item>
                    )}
                />
            )
        }
    }
}

export default RecommendationsTable