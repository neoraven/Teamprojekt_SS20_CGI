import React from 'react';
import Stocks from '../components/Stocks';
import api from '../utils/api';
import { Link } from 'react-router-dom';

class StocksList extends React.Component {
  state = {
    stocks: [],
  }
  componentDidMount() {
    api.get('/api/stocks/list/details/')
      .then(res => {
        this.setState({
          stocks: res.data
        })
      })
  }
  log(arg) {
    if (arg === true) {
      localStorage.setItem('logged', 2)
      window.location.reload();
      return
    } else { 
      return
    }
  }

  render() {
    return (
      <div>
        {this.props.isAuthenticated && localStorage.getItem('logged') == null ?
        localStorage.setItem('logged',1)
        :
          <p></p>
        }
        {localStorage.getItem('logged') == 1 ?
        this.log(true)
        :
          <p></p>
        }


        {this.props.isAuthenticated ?
          <Stocks data={this.state.stocks} />
          :
          <p>Please <Link to='/login'>Login</Link> to see the list of stocks.</p>
        }
      </div>
    )
  }
}

export default StocksList
