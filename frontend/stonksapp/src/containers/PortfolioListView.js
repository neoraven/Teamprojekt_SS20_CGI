import React from 'react';
import axios from 'axios';
import Portfolio from '../components/Portfolio';
import SelectStock from '../components/SelectStock';


/*  What do i want in my portfolio?
      -> Symbol
      -> Amount owned
      -> Price purchased
        -> [date of last purchase]?
      -> Price change today
      -> Actual Price
        -> [Amount won/lost]?
        -> [Cash value of each position]?
      -> Mark to market value of entire protfolio
*/


class PortfolioList extends React.Component {
    state = {
        portfolio: [],
        transactions: [],
        stocks: [],
        comp: [{
            company_name: "",
            symbol: "",
            displayname: "",
        }]
    }


    componentDidMount() {
        var AuthStr = 'Token '.concat(localStorage.getItem('token'));

        var config = {
            headers: {'Authorization': AuthStr}
        };

        console.log(AuthStr);
        axios.get('http://127.0.0.1:8000/api/stocks/', config)
            .then(res => {
                this.setState({
                    stocks: res.data
                })
                for (let stock of this.state.stocks) {
                    let combine = stock.company_name + '; (' + stock.symbol + ')';
                    this.state.comp.push({
                        company_name: stock.company_name.toString(),
                        symbol: stock.symbol.toString(),
                        displayname: combine.toString(),
                    })
                }
            })

        axios.get('http://127.0.0.1:8000/api/portfolio/list/', config)
            .then(res => {
                this.setState({
                    portfolio: res.data
                })
            })

        axios.get('http://127.0.0.1:8000/api/portfolio/transaction/list/', config)
            .then(res => {
                this.setState({
                    transactions: res.data
                })
            })
    }

    render() {
        return (
            <div id="list-view">
                <div id="portfolio"><Portfolio portfolio={this.state.portfolio} transactions={this.state.transactions}/>
                </div>
                <div id="selector"><SelectStock stocks={this.state.comp}/></div>
            </div>
        )
    }
}

export default PortfolioList
