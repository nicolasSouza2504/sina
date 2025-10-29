package senai.com.ava_senai.services.task;

import com.google.gson.Gson;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import senai.com.ava_senai.config.RabbitMQConfig;
import senai.com.ava_senai.domain.task.*;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.*;
import senai.com.ava_senai.services.messaging.RabbitMQSender;
import senai.com.ava_senai.taskuser.TaskUser;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final RabbitMQSender rabbitMQSender;
    private final TaskUserRepository taskUserRepository;
    private final CourseRepository courseRepository;
    private final KnowledgeTrailRepository knowledgeTrailRepository;

    @Override
    public TaskResponseDTO createTask(TaskRegisterDTO taskRegister) {

        validateMandatoryFields(taskRegister);
        Task task = create(taskRegister);

        sendMessageCreateUsersTask(task.getId(), taskRegister.courseId());

        return new TaskResponseDTO(task);

    }

    @Override
    public void saveTaskUsersForCourse(TaskUserCourseMessage taskUserCourseMessage) {

        // Get all users from the course
        List<User> users = userRepository.findByCourseId(taskUserCourseMessage.getCourseId());

        // Create user tasks for each user in the course
        users.forEach(user -> {

            //todo trazer somente os usuários que não existem para evitar consulta desnecessária
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

    @Override
    public TaskResponseDTO getTaskById(@Valid Long id) {

        Task task = taskRepository.findById(id).orElseThrow(() -> new NotFoundException("Tarefa não encontrada"));

        return new TaskResponseDTO(task);

    }

    @Override
    public TaskRegisterDTO updateTask(Long id) throws Exception {
        return null;
    }

    private Task create(TaskRegisterDTO taskRegister) {

        Task task = new Task();

        task.setName(taskRegister.name());
        task.setDescription(taskRegister.description());
        task.setKnowledgeTrailId(taskRegister.knowledgeTrailId());
        task.setDifficultyLevel(taskRegister.difficultyLevel());
        task.setDueDate(taskRegister.dueDate());

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

    public void validateMandatoryFields(TaskRegisterDTO taskRegister) {

        Validation validation = new Validation();

        if (taskRegister.courseId() == null) {
            validation.add("courseId", "Curso é obrigatório");
        } else if (!courseRepository.existsById(taskRegister.courseId())) {
            validation.add("courseId", "Curso informado não existe");
        }

        if (taskRegister.knowledgeTrailId() == null) {
            validation.add("knowledgeTrailId", "Trilha de conhecimento é obrigatória");
        } else {

            KnowledgeTrail knowledgeTrail = knowledgeTrailRepository.findById(taskRegister.knowledgeTrailId()).orElse(null);

            if (knowledgeTrail == null) {
                validation.add("knowledgeTrailId", "Trilha de conhecimento informada não existe");
            } else if (BooleanUtils.isTrue(knowledgeTrail.getRanked())) {

                if (taskRegister.difficultyLevel() == null) {
                    validation.add("difficultyLevel", "Nível de dificuldade é obrigatório para trilhas ranqueadas");
                }

                if (taskRegister.dueDate() == null) {
                    validation.add("dueDate", "Data de entrega é obrigatória para trilhas ranqueadas");
                }

            }

        }

        validation.throwIfHasErrors();


    }


}
