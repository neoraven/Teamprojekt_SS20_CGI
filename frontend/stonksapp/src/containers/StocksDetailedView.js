import React from 'react';
import axios from 'axios';


//UNUSED& UNFINISHED

class StocksDetail extends React.Component {
  state = {
    stocks: {}
  }
  componentDidMount(){
    const stockID = this.props.match.params.stockID
    axios.get('http://127.0.0.1:8000/api/stocks/${stockID}')
      .then(res => {
        this.setState({
          stocks : res.data
        })
        console.log(res.data);
      })
  }

  render(){
    return(

    )
  }
}

export default StocksDetail;
