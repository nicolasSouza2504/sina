package senai.com.ava_senai.services.ranking.calculatorstrategy;


import org.springframework.stereotype.Component;
import senai.com.ava_senai.domain.ranking.ScoreCalculatorTypeEnum;
import senai.com.ava_senai.domain.ranking.TaskRankingCalculatorDTO;
import senai.com.ava_senai.domain.ranking.TimeConsumedScore;
import senai.com.ava_senai.services.ranking.calculatorstrategy.anottation.ScoreCalculatorType;

import java.util.Date;
import java.util.List;

@Component
@ScoreCalculatorType(ScoreCalculatorTypeEnum.TIME)
public class TimeScoreCalculator implements IScoreCalculator {

    private static final double MILLIS_IN_DAY = 86_400_000d;

    @Override
    public double calculate(List<TaskRankingCalculatorDTO> tasksReviewed) {

        if (tasksReviewed.isEmpty()) {
            return 0d;
        }

        double totalPercentResponseTimeConsumed = tasksReviewed.stream()
                .mapToDouble(taskReviewed -> {

                    Date creationDate = taskReviewed.getTask().getCreatedAt();
                    Date dueDate = taskReviewed.getTask().getDueDate();
                    Date responseDate = taskReviewed.getUserResponse().getCreatedAt();

                    double totalDays =
                            (dueDate.getTime() - creationDate.getTime()) / MILLIS_IN_DAY;

                    double daysToResponse =
                            (responseDate.getTime() - creationDate.getTime()) / MILLIS_IN_DAY;

                    double percentTimeConsumed = (daysToResponse / totalDays) * 100d;

                    return percentTimeConsumed;

                })
                .sum();

        double mediumPercentTimeConsumed =
                totalPercentResponseTimeConsumed / tasksReviewed.size();

        return TimeConsumedScore.valueOf(mediumPercentTimeConsumed);

    }

}
