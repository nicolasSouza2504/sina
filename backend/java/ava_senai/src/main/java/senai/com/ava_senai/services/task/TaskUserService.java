package senai.com.ava_senai.services.task;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import senai.com.ava_senai.domain.task.taskuser.TaskUser;
import senai.com.ava_senai.domain.task.taskuser.TaskUserRegister;
import senai.com.ava_senai.domain.task.taskuser.TaskUserResponseDTO;
import senai.com.ava_senai.domain.task.taskuser.TaskUserResponseSummaryDTO;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.repository.TaskUserRepository;
import senai.com.ava_senai.repository.UserRepository;
import senai.com.ava_senai.repository.UserResponseRepository;

@Service
@RequiredArgsConstructor
public class TaskUserService implements ITaskUserService {

    private final TaskUserRepository taskUserRepository;
    private final UserResponseRepository userResponseRepository;
    private final UserRepository userRepository;

    @Override
    public TaskUserResponseSummaryDTO getUserTaskByUserAndTaskId(Long userId, Long taskId) {
        Optional<TaskUser> taskUser = taskUserRepository.findByUserIdAndTaskId(userId, taskId);
        if (taskUser.isEmpty()) {
            this.saveTaskUser(new TaskUserRegister(userId, taskId));
            taskUser = taskUserRepository.findByUserIdAndTaskId(userId, taskId);
        }

        Optional<UserResponse> userResponse = userResponseRepository
                .findUserResponseByTaskUserId(taskUser.get().getId());

        return new TaskUserResponseSummaryDTO(taskUser.get(), userResponse);
    }

    @Transactional
    public TaskUserResponseDTO saveTaskUser(TaskUserRegister taskUserRegister) {

        User user = userRepository.findById(taskUserRegister.userId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        TaskUser userTask = new TaskUser();

        userTask.setTaskId(taskUserRegister.taskId());
        userTask.setIdInstitution(user.getIdInstitution());
        userTask.setUserId(user.getId());

        taskUserRepository.save(userTask);

        return new TaskUserResponseDTO(userTask);
    }
}
