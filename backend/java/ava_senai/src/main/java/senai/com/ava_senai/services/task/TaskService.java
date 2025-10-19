package senai.com.ava_senai.services.task;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import senai.com.ava_senai.config.RabbitMQConfig;
import senai.com.ava_senai.domain.task.*;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.repository.TaskContentRepository;
import senai.com.ava_senai.repository.TaskRepository;
import senai.com.ava_senai.repository.TaskUserRepository;
import senai.com.ava_senai.repository.UserRepository;
import senai.com.ava_senai.services.messaging.RabbitMQSender;
import senai.com.ava_senai.taskuser.TaskUser;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {

    private final UserRepository userRepository;
    private final TaskContentRepository taskContentRepository;
    private final TaskRepository taskRepository;
    private final RabbitMQSender rabbitMQSender;
    private final TaskUserRepository taskUserRepository;

    @Override
    public List<TaskResponseDTO> createTasks(List<TaskRegisterDTO> tasksRegister) {

        List<TaskResponseDTO> tasksResponsesDTOS = new ArrayList<>();

        tasksRegister.forEach(taskRegister -> {

            Task task = createTask(taskRegister);

            sendMessageCreateUsersTask(task.getId(), taskRegister.courseId());

            List<TaskContentResponseDTO> taskContents = createTaskContents(task, taskRegister.contents());

            tasksResponsesDTOS.add(new TaskResponseDTO(task.getId(), taskContents));

        });

        return tasksResponsesDTOS;

    }

    @Override
    public void saveTaskUsersForCourse(TaskUserCourseMessage taskUserCourseMessage) {

        // Get all users from the course
        List<User> users = userRepository.findByCourseId(taskUserCourseMessage.getCourseId());

        // Create user tasks for each user in the course
        users.forEach(user -> {

            Boolean existsTaskUser = taskUserRepository.existsByTaskIdAndUserId(taskUserCourseMessage.getTaskId(), user.getId());

            if (BooleanUtils.isNotTrue(existsTaskUser)) {

                TaskUser userTask = new TaskUser();

                userTask.setTaskId(taskUserCourseMessage.getTaskId());
                userTask.setIdInstitution(user.getIdInstitution());
                userTask.setUserId(user.getId());

                taskUserRepository.save(userTask);

            }

        });

    }

    private Task createTask(TaskRegisterDTO taskRegister) {

        Task task = new Task();

        task.setName(taskRegister.name());
        task.setDescription(taskRegister.description());
        task.setKnowledgeTrailId(taskRegister.knowledgeTrailId());

        return taskRepository.save(task);

    }

    private void sendMessageCreateUsersTask(Long taskID, Long courseID) {

        String jsonMessage = new Gson().toJson(new TaskUserCourseMessage(taskID, courseID));

        rabbitMQSender.sendMessage(
            RabbitMQConfig.EXCHANGE_TASKS,
            RabbitMQConfig.ROUTING_CREATE_USER_TASK,
            jsonMessage
        );

    }

    private List<TaskContentResponseDTO> createTaskContents(Task task, List<TaskContentRegisterDTO> contents) {

        List<TaskContentResponseDTO> taskContents = new ArrayList<>();

        if (!CollectionUtils.isEmpty(contents)) {

            contents.forEach(contentRegister -> {

                TaskContent taskContent = new TaskContent();

                taskContent.setTask(task);
                taskContent.setContentType(contentRegister.taskContentType());
                taskContent.setIdentifier(contentRegister.identifier());

                taskContents.add(new TaskContentResponseDTO(taskContentRepository.save(taskContent)));

            });

        }

        return taskContents;

    }

}
