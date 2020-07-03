import React from 'react';
import Stocks from '../components/Stocks';
import api from '../utils/api';
import { Link } from 'react-router-dom';




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
      <div>
        {this.props.isAuthenticated ? 
          <Stocks data={this.state.stocks}/>
          :
          <p>Please <Link to='/login'>Login</Link> to see the list of stocks.</p>
        }
      </div>
    )
  }
}

export default StocksList
