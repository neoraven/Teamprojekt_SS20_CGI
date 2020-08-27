from typing import Dict
from pandas import DataFrame


class BaseStrategy:
    def __init__(self, name: str = None):
        self.name = name or type(self).__name__

    def weight(
        self, market_state: DataFrame, agent_portfolio: Dict[str, float]
    ) -> Dict[str, float]:
        pass
