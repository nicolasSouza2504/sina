package senai.com.ava_senai.services.ranking;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.ranking.TaskRankingCalculatorDTO;
import senai.com.ava_senai.domain.ranking.UserRankingCalculatorDTO;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.feedback.Feedback;
import senai.com.ava_senai.domain.task.taskuser.TaskUser;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.repository.TaskUserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingBuilderService implements IRankingBuilderService {

    private final TaskUserRepository taskUserRepository;

    @Override
    public List<UserRankingCalculatorDTO> buildUsersRankingCalculator(Long classId, Long knowledgeTrailId) {

        List<TaskUser> taskUsers = taskUserRepository.findTaskUsersForRanking(classId, knowledgeTrailId);

        // agrupa as tasks por usuário
        Map<User, List<TaskUser>> tasksByUser = taskUsers.stream()
                .collect(Collectors.groupingBy(TaskUser::getUser));

        return buildUserRankingCalculator(tasksByUser);

    }

    private List<UserRankingCalculatorDTO> buildUserRankingCalculator(Map<User, List<TaskUser>> tasksByUser) {

        List<UserRankingCalculatorDTO> userRankingCalculatorDTOS = new ArrayList<>();

        tasksByUser.forEach((user, tasks) -> {

            List<TaskRankingCalculatorDTO> taskRankingCalculatorDTOS = buildTasksRanking(tasks);

            userRankingCalculatorDTOS.add(new UserRankingCalculatorDTO(taskRankingCalculatorDTOS, user));

        });


        return userRankingCalculatorDTOS;

    }

    private List<TaskRankingCalculatorDTO> buildTasksRanking(List<TaskUser> taskUsers) {

        List<TaskRankingCalculatorDTO> taskRankingCalculatorDTOS = new ArrayList<>();

        for (TaskUser taskUser : taskUsers) {

            Task task = taskUser.getTask();
            UserResponse userResponse = taskUser.getUserResponse();
            Feedback feedback = userResponse != null ? userResponse.getFeedback() : null;

            taskRankingCalculatorDTOS.add(new TaskRankingCalculatorDTO(
                    task,
                    taskUser.getUserResponse(),
                    feedback
            ));

        }

        return taskRankingCalculatorDTOS;

    }

}
