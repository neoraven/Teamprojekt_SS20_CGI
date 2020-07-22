import React from 'react';
import BaseRouter from './routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux'
//import './App.css';
import 'antd/dist/antd.css';
import SecondLayout from './containers/Layout2'; //Original Layout
import * as actions from './store/actions/auth';
//import SiderDemo from './containers/TESTLAYOUT1'; // for testing purposes
//import RespoDemo from './containers/TestLayout2'; // new layout


class App extends React.Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }
  render() {
    return (
      <div className="App">
        <Router >
          <SecondLayout {...this.props}>
            <BaseRouter {...this.props}/>
          </SecondLayout>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
    failedAuthentication : state.error !== null //unfinished; cont in layout2
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
