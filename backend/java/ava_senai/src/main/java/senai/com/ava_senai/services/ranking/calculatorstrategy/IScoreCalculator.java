package senai.com.ava_senai.services.ranking.calculatorstrategy;

import senai.com.ava_senai.domain.ranking.TaskRankingCalculatorDTO;

import java.util.List;

public interface IScoreCalculator {
    double calculate(List<TaskRankingCalculatorDTO> tasksReviewed);
}
