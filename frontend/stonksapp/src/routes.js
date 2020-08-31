import React from 'react';
import { Route } from 'react-router-dom';
import StocksList from './containers/StocksListView';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Details from './containers/StocksDetailedView';
import PortfolioList from './containers/PortfolioListView';
import Impressum from './containers/Impressum';
import RecommendationView from './containers/RecommendationView';
import Landingpage from './containers/Landinpage';
import Results from './components/Resultspage'

const BaseRouter = (props) =>(
  <div>
    <Route exact path ='/' component = {Landingpage} />
    <Route exact path ='/stocks/' render = { () => (<StocksList isAuthenticated={props.isAuthenticated}/>)} />
    <Route exact path ='/login/' component = {Login} />
    <Route exact path ='/signup/' component = {Signup} />
    <Route exact path ='/portfolio/' render = { () => (<PortfolioList isAuthenticated={props.isAuthenticated}/>)}/>
    <Route exact path ='/recommendations/' render = { () => (<RecommendationView isAuthenticated={props.isAuthenticated}/>)}/>
    <Route exact path ='/company/:stocksSymbol' component = {Details} />
    <Route exact path ='/impressum/' component = {Impressum} />


    <Route exact path ='/res/' component = {Results} />
  </div>
);

export default BaseRouter;
