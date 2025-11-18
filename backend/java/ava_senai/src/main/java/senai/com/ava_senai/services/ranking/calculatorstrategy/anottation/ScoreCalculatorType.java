package senai.com.ava_senai.services.ranking.calculatorstrategy.anottation;

import senai.com.ava_senai.domain.ranking.ScoreCalculatorTypeEnum;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.ElementType.PARAMETER;

@Retention(RetentionPolicy.RUNTIME)
@Target({FIELD, TYPE, METHOD, PARAMETER})
public @interface ScoreCalculatorType {
    ScoreCalculatorTypeEnum value() default ScoreCalculatorTypeEnum.GRADE;
}
