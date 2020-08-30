from typing import Dict
import pandas as pd

from pypfopt.efficient_frontier import EfficientFrontier
from pypfopt import risk_models
from pypfopt import expected_returns
from pypfopt import discrete_allocation

from ..base_strategy import BaseStrategy


class Markowitz(BaseStrategy):
    def __init__(self, top_n_stocks: int = 10, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def weight(
            self,
            market_state: pd.DataFrame,
            agent_portfolio: Dict[str, float],
            is_recommendation: bool = False,
    ) -> Dict[str, float]:

        #Adjust data structure for library
        prices = market_state.pivot(values="adjusted_close", index="date", columns="symbol")

        # Get Mu and sigma for efficient frontier
        mu = expected_returns.mean_historical_return(prices)
        sigma = risk_models.CovarianceShrinkage(prices).ledoit_wolf()

        # Calculate efficient portfolio, objective: maximize sharpe ratio 
        ef = EfficientFrontier(mu, sigma)
        ef.max_sharpe()
        cleaned_weights = ef.clean_weights()

        '''
        Post-processing weights to give concrete buying recommendations:

        latest_prices = get_latest_prices(prices)
        da = DiscreteAllocation(cleaned_weights, latest_prices, total_portfolio_value=10000)
        allocation, leftover = da.lp_portfolio()
        print("Discrete Allocation: ", allocation)
        print("Leftover: ", leftover)
        '''
        return dict(cleaned_weights)
        #ef.portfolio_performance(verbose=True)






