from typing import List, Dict

import pandas as pd
from pandas._libs.tslibs.timestamps import Timestamp

from datetime import timedelta
from collections import namedtuple
import datetime
import pprint

from .market import Market
from .evaluator import BaseEvaluator
from .base_strategy import BaseStrategy
from .base_pref import BasePreference

from portfolio.models import Transaction as TransactionModel

Transaction = namedtuple(
    typename="Transaction",
    field_names=["symbol", "amount", "date", "stock_price", "total_value"],
)


class Agent:
    def __init__(
        self,
        starting_capital: float,
        market: Market,
        strategy: BaseStrategy,
        evaluator: BaseEvaluator,
        preferences: List[BasePreference],
    ):
        # TODO(jonas): implement agent getting new cash every [x interval]
        self.starting_capital = starting_capital
        self.cash = starting_capital
        self.dragging_balance = 0
        self.market = market
        self.strategy = strategy
        self.evaluator = evaluator
        self.preferences = preferences
        self.mask = None
        self.portfolio = {}
        self.trading_history = []
        self.evaluation_history = []  # list of Dicts

    def run_simulation(self):
        for mask in self.market:
            # print(self.market.max_date)
            self.mask = mask
            # agent gets dividends paid out accd. to his portfolio
            self.cash += self.market.pay_dividends(stock_portfolio=self.portfolio)
            weights = self.strategy.weight(
                market_state=self.market.prices[mask], agent_portfolio=self.portfolio,
            )
            if any([weight != 0 for weight in weights.values()]):
                # any non-0 weights? > evaluate
                # First, apply my preferences in order
                print(f"weights before weighting: {weights}")
                weights = self.apply_preferences(weights=weights, market_mask=mask)
                print("=" * 50)
                print(
                    f"weights after weighting: {weights}, sum: {sum([v for v in weights.values()])}"
                )
                for symbol, weight in filter(lambda x: x[1] < 0, weights.items()):
                    # First: look at negative weights := sell recommendations
                    amount_to_sell = int(weight * self.portfolio.get(symbol, 0))
                    if amount_to_sell != 0:
                        current_stock_price = self.market.get_most_recent_price(
                            symbol=symbol
                        )
                        sell_transaction = self.build_transaction(
                            stock_symbol=symbol,
                            stock_price=current_stock_price,
                            amount=amount_to_sell,
                            date=self.market.max_date,
                        )
                        # print(f"Making sell transaction: {sell_transaction}")
                        self.sell(sell_transaction)
                total_cash_before_transactions = self.cash
                weights = {
                    s: w
                    for (s, w) in sorted(
                        weights.items(), key=lambda item: item[1], reverse=True
                    )
                }
                for symbol, weight in filter(lambda x: x[1] > 0, weights.items()):
                    current_stock_price = self.market.get_most_recent_price(
                        symbol=symbol
                    )
                    amount_to_spend = min(
                        (
                            weight * total_cash_before_transactions
                            + self.dragging_balance
                        ),
                        self.cash,
                    )
                    amount_of_stocks_to_buy = amount_to_spend // current_stock_price
                    self.dragging_balance += amount_to_spend % current_stock_price
                    if amount_of_stocks_to_buy == 0:
                        # print(
                        #     f"Cant buy {symbol} for {current_stock_price}, I want to spend {amount_to_spend}"
                        # )
                        continue
                    purchase_transaction = self.build_transaction(
                        stock_symbol=symbol,
                        stock_price=current_stock_price,
                        amount=amount_of_stocks_to_buy,
                        date=self.market.max_date,
                    )
                    # print(f"Making purchase transaction: {purchase_transaction}")
                    self.buy(purchase_transaction)
            self.evaluate()

    @staticmethod
    def build_transaction(
        stock_symbol: str, stock_price: float, amount: int, date: Timestamp
    ) -> Transaction:
        total_price = amount * stock_price
        return Transaction(
            symbol=stock_symbol,
            amount=amount,
            date=date,
            stock_price=stock_price,
            total_value=total_price,
        )

    def buy(self, transaction: Transaction):
        total_price = transaction.amount * transaction.stock_price
        assert (
            self.cash + self.dragging_balance - total_price >= 0
        ), "Can't spend more than you have!"
        deducted_from_dragging_balance = min(total_price, self.dragging_balance)
        remaining_amount_to_pay = total_price - deducted_from_dragging_balance
        self.dragging_balance -= deducted_from_dragging_balance
        self.cash -= remaining_amount_to_pay
        self.portfolio[transaction.symbol] = (
            self.portfolio.get(transaction.symbol, 0) + transaction.amount
        )
        self.trading_history.append(transaction)

    def sell(self, transaction: Transaction):
        assert transaction.amount < 0, "Sell transactions must have a negative amount!"
        # transaction.amount HAS TO BE NEGATIVE
        total_price = transaction.amount * transaction.stock_price
        self.cash -= total_price
        self.portfolio[transaction.symbol] = (
            self.portfolio.get(transaction.symbol, 0) + transaction.amount
        )
        if self.portfolio.get(transaction.symbol) == 0:
            self.portfolio.pop(transaction.symbol, None)

        self.trading_history.append(transaction)

    def print_stats(self):
        spacing = "\n\n=======================================\n\n"
        print("History of transactions in order of occurence:\n")
        for trade in self.trading_history:
            print(trade)
        print(spacing)
        print("Current portfolio:\n")
        pprint.pprint(self.portfolio)
        print(spacing)
        print("Performance verdict:\n")
        print(self.evaluate())

    def get_own_total_value(self, **kwargs):
        total_value = self.cash
        for stock, amount in self.portfolio.items():
            total_value += (
                self.market.get_most_recent_price(symbol=stock, **kwargs) * amount
            )

        return total_value

    @staticmethod
    def iterate_dates(start_date, end_date, step_size):
        curr_date = start_date + step_size
        while curr_date <= end_date:
            yield curr_date
            curr_date += step_size

    def evaluate(self):
        daily_delta = timedelta(days=1)
        last_eval_date = (
            self.evaluation_history[-1].get("date")
            if self.evaluation_history
            else self.market.prices.date.min()
        )
        for date in self.iterate_dates(
            start_date=last_eval_date,
            end_date=self.market.max_date,
            step_size=daily_delta,
        ):
            evaluation_result = self.evaluator.evaluate(self, for_date=date)
            self.evaluation_history.append(
                {
                    "date": date,  # pd.to_datetime(date).strftime("%Y-%m-%d")
                    "score": evaluation_result,
                }
            )

    def apply_preferences(
        self,
        weights: Dict[str, float],
        market_mask,
        also_give_reasons: bool = False,
        prev_reasons: Dict[str, str] = {},
    ):
        for preference in self.preferences:
            if also_give_reasons:
                weights, reasons = preference.apply(
                    old_weights=weights,
                    market_state=self.market.prices[market_mask],
                    current_date=self.market.max_date,
                    also_give_reasons=also_give_reasons,
                )
                for symbol, reason in reasons.items():
                    prev_reasons[symbol] = " ".join(
                        [prev_reasons.get(symbol, ""), reason]
                    )
            else:
                weights = preference.apply(
                    old_weights=weights,
                    market_state=self.market.prices[market_mask],
                    current_date=self.market.max_date,
                    also_give_reasons=also_give_reasons,
                )

        if also_give_reasons:
            return weights, prev_reasons
        else:
            return weights

    def misc_evaluate(self):
        gains_or_losses_percentage = (
            self.get_own_total_value() / self.starting_capital - 1
        )
        percentage_string = "{0:.2%}".format(gains_or_losses_percentage)
        evaluation_sentence = (
            f"Gained {percentage_string}!"
            if gains_or_losses_percentage > 0
            else f"Lost {percentage_string}!"
        )
        return evaluation_sentence

    def recommend(self):
        recommendations = self.strategy.recommend(
            market_state=self.market.prices[self.mask]
        )
        reasons = self.strategy.give_reasons(weights=recommendations) or {}

        recommendations, reasons = self.apply_preferences(
            weights=recommendations,
            market_mask=self.mask,
            also_give_reasons=True,
            prev_reasons=reasons,
        )
        non_zero_recommendations = {
            stock: weight for (stock, weight) in recommendations.items() if weight != 0
        }

        formatted_recommendations = [
            {"symbol": s, "weight": w, "reason": reasons.get(s, "No reason specified")}
            for (s, w) in non_zero_recommendations.items()
        ]
        return formatted_recommendations
