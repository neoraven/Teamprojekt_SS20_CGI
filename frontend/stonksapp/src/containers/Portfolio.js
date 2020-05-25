import React from 'react';
import axios from 'axios';

const AuthStr = 'Token '.concat(localStorage.getItem('token')); //unsave, needs to be changed when authtoken works

const config = {
  headers: { 'Authorization': AuthStr } //'4dfc7044f1c1e1c5b51922b8e46b68c83953539f' 
};

const bodyParameters = {
  key: "value"
};



class Portfolio extends React.Component {
  state = {
    portfolio: []
  }


  componentDidMount() {
    console.log(AuthStr);
    axios.get('http://127.0.0.1:8000/api/portfolio/list/', config)
      .then(res => {
        this.setState({
          portfolio: res.data
        })
      })
  }

  render() {
    console.log(AuthStr);
    return (

      <div> Authorization not working yet (but why?) </div>
    )
  }
}

export default Portfolio
