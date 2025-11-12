package senai.com.ava_senai.consumer;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.config.RabbitMQConfig;
import senai.com.ava_senai.domain.task.TaskUserCourseMessage;
import senai.com.ava_senai.services.task.ITaskService;
import senai.com.ava_senai.services.task.TaskService;

import java.util.logging.Level;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class TaskUserConsumer {

    private final ITaskService taskService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_USER_TASKS)
    public void consumeMessage(String message) {

        try {

            TaskUserCourseMessage taskUserCourseMessage = new Gson().fromJson(message, TaskUserCourseMessage.class);

            Logger.getLogger(TaskUserConsumer.class.getName()).log(Level.INFO, "Processando mensagem de criação de tarefa " + taskUserCourseMessage.getTaskId() +  " para usuários do curso: " + taskUserCourseMessage.getCourseId());

            taskService.saveTaskUsersForCourse(taskUserCourseMessage);

        } catch (Exception e) {
            // Log error and possibly send to DLQ
            throw new RuntimeException("Error processing user task message", e);
        }

    }

}
