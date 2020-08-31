from typing import Dict
from pandas import DataFrame


class BaseStrategy:
    def __init__(self, name: str = None, **kwargs):
        self.name = name or type(self).__name__

    def weight(
        self, market_state: DataFrame, agent_portfolio: Dict[str, float], **kwargs
    ) -> Dict[str, float]:
        pass

    def recommend(self, market_state: DataFrame, **kwargs) -> Dict[str, float]:
        pass

    def give_reasons(self, weights: Dict[str, float], **kwargs) -> Dict[str, str]:
        pass
