package senai.com.ava_senai.services.task;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.stereotype.Service;

import senai.com.ava_senai.domain.task.taskuser.TaskUser;
import senai.com.ava_senai.domain.task.taskuser.TaskUserResponseSummaryDTO;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.repository.TaskUserRepository;
import senai.com.ava_senai.repository.UserResponseRepository;

@Service
@RequiredArgsConstructor
public class TaskUserService implements ITaskUserService {

    private final TaskUserRepository taskUserRepository;
    private final UserResponseRepository userResponseRepository;

    @Override
    public TaskUserResponseSummaryDTO getUserTaskByUserAndTaskId(Long userId, Long taskId) {
        Optional<TaskUser> taskUser = taskUserRepository.findByUserIdAndTaskId(userId, taskId);

        Optional<UserResponse> userResponse = userResponseRepository
                .findUserResponseByTaskUserId(taskUser.get().getId());

        return new TaskUserResponseSummaryDTO(taskUser.get(), userResponse);
    }
}