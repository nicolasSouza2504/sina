package senai.com.ava_senai.services.task;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import senai.com.ava_senai.config.RabbitMQConfig;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.TaskContentUploadStatus;
import senai.com.ava_senai.domain.task.TaskRegisterDTO;
import senai.com.ava_senai.domain.task.TaskResponseDTO;
import senai.com.ava_senai.domain.task.UserTaskMessage;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;
import senai.com.ava_senai.repository.TaskContentRepository;
import senai.com.ava_senai.repository.TaskRepository;
import senai.com.ava_senai.services.messaging.RabbitMQSender;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {

    private final TaskContentRepository taskContentRepository;
    private final TaskRepository taskRepository;
    private final RabbitMQSender rabbitMQSender;

    @Override
    public List<TaskResponseDTO> createTasks(List<TaskRegisterDTO> tasksRegister) {

        List<TaskResponseDTO> tasksResponsesDTO = new ArrayList<>();

        tasksRegister.forEach(taskRegister -> {

            Task task = createTask(taskRegister);

            createUsersTask(task.getId(), taskRegister.courseId());
            createTaskContents(task, taskRegister.contents());

        });

        return List.of();

    }

    private Task createTask(TaskRegisterDTO taskRegister) {

        Task task = new Task();

        task.setName(taskRegister.name());
        task.setDescription(taskRegister.description());
        task.setKnowledgeTrailId(taskRegister.knowledgeTrailId());

        return taskRepository.save(task);

    }

    private void createUsersTask(Long taskID, Long courseID) {

        String jsonMessage = new Gson().toJson(new UserTaskMessage(taskID, courseID));

        rabbitMQSender.sendMessage(
            RabbitMQConfig.EXCHANGE_TASKS,
            RabbitMQConfig.ROUTING_CREATE_USER_TASK,
            jsonMessage
        );

    }

    private List<TaskContent> createTaskContents(Task task, List<TaskContentRegisterDTO> contents) {

        List<TaskContent> taskContents = new ArrayList<>();

        if (CollectionUtils.isEmpty(contents)) {

            contents.forEach(contentRegister -> {

                TaskContent taskContent = new TaskContent();

                taskContent.setTask(task);
                taskContent.setContentType(contentRegister.taskContentType());
                taskContent.setIdentifier(contentRegister.identifier());
                taskContent.setStatus(TaskContentUploadStatus.PENDING);

                taskContents.add(taskContentRepository.save(taskContent));

            });

        }

        return taskContents;

    }

}
