from typing import Dict
import pandas as pd

from pypfopt.efficient_frontier import EfficientFrontier
from pypfopt import risk_models
from pypfopt import expected_returns

from stocks.models import Price
from ..base_strategy import BaseStrategy

class Markowitz(BaseStrategy):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def weight(
            self,
            market_state: pd.DataFrame,
            agent_portfolio: Dict[str, float],
            is_recommendation: bool = False,
    ) -> Dict[str, float]:
        # make default weight map

        weights = {}
        stocks = set(market_state.symbol.unique())
        for stock in stocks:
            weights[stock] = 0.0

        current_date = market_state.date.max()

        if current_date.year == market_state.date.min().year:
            # there is no previous year
            return weights
        if not is_recommendation:
            if current_date != market_state.loc[
                market_state.date.dt.year == current_date.year
            ].date.min():

                all_dates = pd.DataFrame(Price.objects.values("date"), columns=["date"])
                all_dates.date = pd.to_datetime(all_dates.date)
                all_dates.drop_duplicates(ignore_index=True, inplace=True)

                # it's not the first trading day of the current year
                if current_date == all_dates[
                    (all_dates.date.dt.year == current_date.year) &
                    (all_dates.date.dt.month == 12)
                ].date.max():
                    for stock in agent_portfolio.keys():
                        weights[stock] = -1
                    return weights
                return weights

        prices = market_state.pivot(values="adjusted_close", index="date", columns="symbol")

        # Get Mu and sigma for efficient frontier
        mu = expected_returns.mean_historical_return(prices)
        sigma = risk_models.CovarianceShrinkage(prices).ledoit_wolf()

        # Calculate efficient portfolio, objective: maximize sharpe ratio
        ef = EfficientFrontier(mu, sigma, weight_bounds=(0, 1))
        ef.max_sharpe()
        cleaned_weights = ef.clean_weights()

        print(cleaned_weights)
        return dict(cleaned_weights)
        # ef.portfolio_performance(verbose=True)

    def recommend(self, market_state: pd.DataFrame):
        return self.weight(
            market_state=market_state, agent_portfolio={}, is_recommendation=True
        )
