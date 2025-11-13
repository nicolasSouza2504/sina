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
import senai.com.ava_senai.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingBuilderService implements IRankingBuilderService {

    private final UserRepository userRepository;

    @Override
    public List<UserRankingCalculatorDTO> buildUsersRankingCalculator(Long classId, Long knowledgeTrailId) {

        List<User> users = userRepository.findUsersWithTaskToRanking(classId, knowledgeTrailId);

        return buildUserRankingCalculator(users);

    }

    private List<UserRankingCalculatorDTO> buildUserRankingCalculator(List<User> users) {

        List<UserRankingCalculatorDTO> userRankingCalculatorDTOS = new ArrayList<>();

        if (!users.isEmpty()) {

            for (User user : users) {

                List<TaskRankingCalculatorDTO> taskRankingCalculatorDTOS = buildTasksRanking(user.getTaskUsers());

                userRankingCalculatorDTOS.add(new UserRankingCalculatorDTO(taskRankingCalculatorDTOS, user));

            }

        }

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
