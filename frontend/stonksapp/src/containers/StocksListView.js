import React from 'react';
import Stocks from '../components/Stocks';
import axios from 'axios';




class StocksList extends React.Component {
  state = {
    stocks: []
  }
  componentDidMount() {
    axios.get('http://127.0.0.1:8000/api/stocks/')
      .then(res => {
        this.setState({
          stocks: res.data
        })
      })
  }

  render() {
    console.log(this.state.stocks);
    return (

      <Stocks data={this.state.stocks} />
    )
  }
}

export default StocksList
