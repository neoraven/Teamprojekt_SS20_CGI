from pandas._libs.tslibs.timestamps import Timestamp

from collections import namedtuple
import pprint

from .market import Market
from .evaluator import BaseEvaluator
from .base_strategy import BaseStrategy

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
    ):
        # TODO(jonas): implement agent getting new cash every [x interval]
        self.starting_capital = starting_capital
        self.cash = starting_capital
        self.market = market
        self.strategy = strategy
        self.evaluator = evaluator
        self.mask = None
        self.portfolio = {}
        self.trading_history = []
        self.evaluation_history = []  # list of Dicts

    def run_simulation(self):
        for mask in self.market:
            dragging_balance = 0
            self.mask = mask
            # agent gets dividends paid out accd. to his portfolio
            self.cash += self.market.pay_dividends(stock_portfolio=self.portfolio)
            weights = self.strategy.weight(
                market_state=self.market.prices[mask], agent_portfolio=self.portfolio,
            )
            if any([weight != 0 for weight in weights.values()]):
                # any non-0 weights? > evaluate
                print(weights)
                for symbol, weight in filter(lambda x: x[1] < 0, weights.items()):
                    # First: look at negative weights := sell recommendations
                    current_stock_price = self.market.get_most_recent_price(
                        symbol=symbol
                    )
                    sell_transaction = self.build_transaction(
                        stock_symbol=symbol,
                        stock_price=current_stock_price,
                        amount=int(weight * self.portfolio.get(symbol)),
                        date=self.market.max_date,
                    )
                    print(f"Making sell transaction: {sell_transaction}")
                    self.sell(sell_transaction)
                total_cash_before_transactions = self.cash
                for symbol, weight in filter(lambda x: x[1] > 0, weights.items()):
                    current_stock_price = self.market.get_most_recent_price(
                        symbol=symbol
                    )
                    amount_to_spend = min(
                        (weight * total_cash_before_transactions + dragging_balance),
                        self.cash,
                    )
                    amount_of_stocks_to_buy = amount_to_spend // current_stock_price
                    if amount_of_stocks_to_buy == 0:
                        print(
                            f"Cant buy {symbol} for {current_stock_price}, I want to spend {amount_to_spend}"
                        )
                        dragging_balance += amount_to_spend
                        continue
                    dragging_balance = 0
                    purchase_transaction = self.build_transaction(
                        stock_symbol=symbol,
                        stock_price=current_stock_price,
                        amount=amount_of_stocks_to_buy,
                        date=self.market.max_date,
                    )
                    print(f"Making purchase transaction: {purchase_transaction}")
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
        assert self.cash - total_price >= 0, "Can't spend more than you have!"
        self.cash -= total_price
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

    def get_own_total_value(self):
        total_value = self.cash
        for stock, amount in self.portfolio.items():
            total_value += self.market.get_most_recent_price(symbol=stock) * amount

        return total_value

    def evaluate(self):
        evaluation_result = self.evaluator.evaluate(self)
        self.evaluation_history.append({str(self.market.max_date): evaluation_result})

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
        non_zero_recommendations = {
            stock: weight for (stock, weight) in recommendations.items() if weight != 0
        }
        return non_zero_recommendations
