import React from 'react';
import axios from 'axios';


//UNUSED& UNFINISHEDba  

class StocksDetail extends React.Component {
  state = {
    stock: {},
    prices: []
  }
  componentDidMount(){
    const symbol = this.props.match.params.stocksSymbol
    console.log(symbol)
    axios.get(`http://127.0.0.1:8000/api/stocks/${symbol}`)
      .then(res => {
        this.setState({
          stock : res.data
        })
        console.log(res.data);
      })
      axios.get(`http://127.0.0.1:8000/api/stocks/${symbol}/prices/`)
      .then(res => {
        this.setState({
          prices : res.data
        })
        console.log(res.data);
      })
      
  }

  render(){
    return(
       <div>content</div> 
    )
  }
}

export default StocksDetail;
