package senai.com.ava_senai.services.ranking;

import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.ranking.StudentRankingDTO;
import senai.com.ava_senai.domain.ranking.TaskRankingCalculatorDTO;
import senai.com.ava_senai.domain.ranking.TimeConsumedScore;
import senai.com.ava_senai.domain.ranking.UserRankingCalculatorDTO;
import senai.com.ava_senai.domain.user.User;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RankingCalculatorService implements IRankingCalculatorService {

    private static final int GRADE_POINTS_PERCENTAGE = 75;
    private static final int TIME_POINTS_PERCENTAGE = 25;

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

        Double conclusionPercent = (countTasksSent / totalTasks) * 100d;

        User user = userCalculator.getUser();

        return new StudentRankingDTO()
                .builder()
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

        //max points 100
        // 75% grade 25% time consumed

        Double points = getPointsGrade(tasksReviewed);

        points += getPointsTimeConsumed(tasksReviewed);

        return points;

    }

    private Double getPointsGrade(List<TaskRankingCalculatorDTO> tasksReviewed) {

        Integer totalTasks = tasksReviewed.size();


        Double totalGrade = getTotalGrade(tasksReviewed);

        Double mediumGradePercent = totalGrade / totalTasks * GRADE_POINTS_PERCENTAGE;

        return mediumGradePercent;

    }

    private Integer getPointsTimeConsumed(List<TaskRankingCalculatorDTO> tasksReviewed) {

        Double totalPercentResponseTimeConsumed = tasksReviewed.stream()
                .mapToDouble(taskReviewed -> {

                    Date creationDate = taskReviewed.getTask().getCreatedAt();
                    Date dueDate = taskReviewed.getTask().getDueDate();

                    Double totalDays = Long.valueOf(dueDate.getTime()).doubleValue()- Long.valueOf(creationDate.getTime()).doubleValue() / (1000 * 60 * 60 * 24);
                    Double totalDaysToResponse = Long.valueOf(taskReviewed.getUserResponse().getCreatedAt().getTime()) - Long.valueOf(creationDate.getTime()).doubleValue() / (1000 * 60 * 60 * 24);

                    Double percentTimeConsumed = (totalDaysToResponse / totalDays) * 100;

                    return percentTimeConsumed;

                })
                .sum();

        Double mediumPercentTimeConsumed = totalPercentResponseTimeConsumed / tasksReviewed.size() * 100;

        return TimeConsumedScore.valueOf(mediumPercentTimeConsumed);

    }

    private Double getTotalGrade(List<TaskRankingCalculatorDTO> tasksReviewed) {
        return tasksReviewed.stream()
                .mapToDouble(taskReviewed -> taskReviewed.getFeedback().getGrade())
                .sum();

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


