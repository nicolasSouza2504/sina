package senai.com.ava_senai.services.ranking;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.ranking.*;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.services.ranking.calculatorstrategy.ScoreCalculatorStrategy;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingCalculatorService implements IRankingCalculatorService {

    private final ScoreCalculatorStrategy scoreCalculatorStrategy;

    @Override
    public List<StudentRankingDTO> calculate(List<UserRankingCalculatorDTO> usersCalculator) {

        return usersCalculator.stream()
                .map(this::calculateInfos)
                .sorted(sortUsersByPoints())
                .toList();

    }

    private Comparator<? super StudentRankingDTO> sortUsersByPoints() {
        return Comparator.comparingDouble(StudentRankingDTO::getPointsEarned).reversed();
    }

    public StudentRankingDTO calculateInfos(UserRankingCalculatorDTO userCalculator) {

        List<TaskRankingCalculatorDTO> tasksReviewed = getTasksRevieweds(userCalculator);

        Integer totalTasks = userCalculator.getTasksCalculator().size();
        Integer countTasksSent = countTasksSent(userCalculator).intValue();
        Integer countTasksReviewed = tasksReviewed.size();

        Double conclusionPercent = (countTasksSent.doubleValue() / totalTasks.doubleValue()) * 100;

        User user = userCalculator.getUser();

        return StudentRankingDTO.builder()
                .name(user.getName())
                .conclusionPercent(conclusionPercent)
                .tasksReviewed(countTasksReviewed)
                .tasksSent(countTasksSent)
                .totalTasks(totalTasks)
                .lastResponseDate(getLastResponseDate(userCalculator))
                .pointsEarned(calculatePointsEarned(tasksReviewed))
                .build();

    }

    private Double calculatePointsEarned(List<TaskRankingCalculatorDTO> tasksReviewed) {

        double gradePoints = scoreCalculatorStrategy
                .getStrategy(ScoreCalculatorTypeEnum.GRADE)
                .calculate(tasksReviewed);

        double timePoints = scoreCalculatorStrategy
                .getStrategy(ScoreCalculatorTypeEnum.TIME)
                .calculate(tasksReviewed);

        return gradePoints + timePoints;

    }

    private Date getLastResponseDate(UserRankingCalculatorDTO userCalculator) {

        return userCalculator.getTasksCalculator().stream()
                .filter(task -> task.getUserResponse() != null)
                .max(Comparator.comparing(task -> task.getUserResponse().getCreatedAt()))
                .map(task -> task.getUserResponse().getCreatedAt())
                .orElse(null);

    }

    private List<TaskRankingCalculatorDTO> getTasksRevieweds(UserRankingCalculatorDTO userCalculator) {
        return userCalculator.getTasksCalculator().stream().filter(task -> task.getFeedback() != null).collect(Collectors.toList());
    }

    private Long countTasksSent(UserRankingCalculatorDTO userCalculator) {
        return userCalculator.getTasksCalculator().stream().filter(task -> task.getUserResponse() != null).count();
    }

}


