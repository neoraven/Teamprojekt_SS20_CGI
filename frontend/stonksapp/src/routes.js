import React from 'react';
import { Route } from 'react-router-dom';
import StocksList from './containers/StocksListView';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Details from './containers/StocksDetailedView';
import PortfolioList from './containers/PortfolioListView';

const BaseRouter = (props) =>(
  <div>
    <Route exact path ='/' component = {StocksList} />
    <Route exact path ='/login/' component = {Login} />
    <Route exact path ='/signup/' component = {Signup} />
    <Route exact path ='/portfolio/' render = { () => (<PortfolioList isAuthenticated={props.isAuthenticated}/>)}/>
    <Route exact path ='/company/:stocksSymbol' component = {Details} />
  </div>
);

export default BaseRouter;
