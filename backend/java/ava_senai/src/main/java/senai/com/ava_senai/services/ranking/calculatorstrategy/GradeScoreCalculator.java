package senai.com.ava_senai.services.ranking.calculatorstrategy;

import org.springframework.stereotype.Component;
import senai.com.ava_senai.domain.ranking.ScoreCalculatorTypeEnum;
import senai.com.ava_senai.domain.ranking.TaskRankingCalculatorDTO;
import senai.com.ava_senai.services.ranking.calculatorstrategy.anottation.ScoreCalculatorType;

import java.util.List;

@Component
@ScoreCalculatorType(ScoreCalculatorTypeEnum.GRADE)
public class GradeScoreCalculator implements IScoreCalculator {

    private static final int GRADE_POINTS_PERCENTAGE = 75;

    @Override
    public double calculate(List<TaskRankingCalculatorDTO> tasksReviewed) {

        if (tasksReviewed.isEmpty()) {
            return 0d;
        }

        double totalGrade = tasksReviewed.stream()
                .mapToDouble(task -> task.getFeedback().getGrade())
                .sum();

        double averageGrade = (totalGrade / tasksReviewed.size()) / 10d;

        return averageGrade * GRADE_POINTS_PERCENTAGE;

    }

}
