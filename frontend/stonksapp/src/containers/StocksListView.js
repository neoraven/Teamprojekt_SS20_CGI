import React from 'react';
import Stocks from '../components/Stocks';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { BackTop, Empty } from 'antd';


const style = {
  height: 40,
  width: 40,
  lineHeight: '40px',
  borderRadius: 4,
  backgroundColor: '#1088e9',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
};

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
    if (this.state.stocks[0] != undefined) {
      return (
        <div>
          {this.props.isAuthenticated && localStorage.getItem('logged') == null ?
            localStorage.setItem('logged', 1)
            :
            <p></p>
          }
          {localStorage.getItem('logged') == 1 ?
            this.log(true)
            :
            <p></p>
          }


          {this.props.isAuthenticated ?
            <div>
              <Stocks data={this.state.stocks} />
              <BackTop>
                <div style={style}>UP</div>
              </BackTop>
            </div>
            :
            <p>Please <Link to='/login'>Login</Link> to see the list of stocks.</p>
          }
        </div>
      )

    } else if(this.props.isAuthenticated && localStorage.getItem('logged') == null){
      localStorage.setItem('logged', 1)
      this.log(true)
    }else if(this.props.isAuthenticated){
      return(<p></p>)
    }else{
      return(<p>Please <Link to='/login'>Login</Link> to see the list of stocks.</p>)
    }
  }
}

export default StocksList
