import React from 'react';
import axios from 'axios';
import Portfolio from '../components/Portfolio';

const AuthStr = 'Token '.concat(localStorage.getItem('token')); //unsave, needs to be changed when authtoken works

const config = {
  headers: { 'Authorization': AuthStr } //'4dfc7044f1c1e1c5b51922b8e46b68c83953539f' 
};

const bodyParameters = {
  key: "value"
};
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
    console.log(AuthStr);
    return (

      <Portfolio portfolio={this.state.portfolio} transactions={this.state.transactions} />
    )
  }
}

export default PortfolioList
