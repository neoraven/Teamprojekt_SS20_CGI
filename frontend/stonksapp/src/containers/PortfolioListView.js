import React from 'react';
import axios from 'axios';
import Portfolio from '../components/Portfolio';



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
    transactions: []
  }


  componentDidMount() {
    var AuthStr = 'Token '.concat(localStorage.getItem('token')); 

    var config = {
      headers: { 'Authorization': AuthStr }  
    };

    console.log(AuthStr);
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

      <Portfolio portfolio={this.state.portfolio} transactions={this.state.transactions} />
    )
  }
}

export default PortfolioList
