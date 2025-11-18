package senai.com.ava_senai.services.ranking.calculatorstrategy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import senai.com.ava_senai.domain.ranking.ScoreCalculatorTypeEnum;
import senai.com.ava_senai.services.ranking.calculatorstrategy.anottation.ScoreCalculatorType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
public class ScoreCalculatorStrategy {

    private Map<ScoreCalculatorTypeEnum, IScoreCalculator> implementationsMap = new HashMap<>();

    ScoreCalculatorStrategy(List<IScoreCalculator> scoreCalculators) {

        for (IScoreCalculator scoreCalculator : scoreCalculators) {

            try {

                ScoreCalculatorType annotation = scoreCalculator.getClass().getAnnotation(ScoreCalculatorType.class) != null
                        ? scoreCalculator.getClass().getAnnotation(ScoreCalculatorType.class)
                        : scoreCalculator.getClass().getSuperclass().getAnnotation(ScoreCalculatorType.class);

                if (annotation != null) {

                    implementationsMap.put(annotation.value(), scoreCalculator);

                } else {
                    throw new Exception("ScoreCalculatorType not found in class: " + scoreCalculator.getClass().getName());
                }

            } catch (Throwable t) {
                Logger.getLogger("ScoreCalculatorType").severe("Error loading ScoreCalculatorType implementation: " + t.getMessage());
            }


        }

    }

    public IScoreCalculator getStrategy(ScoreCalculatorTypeEnum scoreCalculatorType) {
        return implementationsMap.get(scoreCalculatorType);
    }

}
