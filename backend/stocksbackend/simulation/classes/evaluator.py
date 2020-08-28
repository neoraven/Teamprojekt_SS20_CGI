from typing import Dict
from pandas._libs.tslibs.timestamps import Timestamp

# ---------- INTERFACE --------------------
class BaseEvaluator:
    def evaluate(self, agent) -> float:
        pass


# ---------- V IMPLEMENTATIONS V --------------------
class TotalValueEvaluator(BaseEvaluator):
    def evaluate(self, agent) -> Dict[Timestamp, float]:
        return agent.get_own_total_value()


class MovingValueChangeEvaluator(BaseEvaluator):
    def __init__(self):
        self.value_history = []

    def evaluate(self, agent) -> Dict[Timestamp, float]:
        if not agent.evaluation_history:
            score = 1
        else:
            score = agent.get_own_total_value() / self.value_history[-1]

        self.remember(agent.get_own_total_value())
        return score

    def remember(self, value):
        self.value_history.append(value)
