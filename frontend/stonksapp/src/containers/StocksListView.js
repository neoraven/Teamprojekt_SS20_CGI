import React from 'react';
import Stocks from '../components/Stocks';
import api from '../utils/api';




class StocksList extends React.Component {
  state = {
    stocks: []
  }
  componentDidMount() {
    api.get('/api/stocks/list/details/')
      .then(res => {
        this.setState({
          stocks: res.data
        })
      })
  }

  render() {
    return (

      <Stocks data={this.state.stocks} />
    )
  }
}

export default StocksList
