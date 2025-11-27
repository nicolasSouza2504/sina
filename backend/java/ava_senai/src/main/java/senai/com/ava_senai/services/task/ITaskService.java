package senai.com.ava_senai.services.task;

import jakarta.validation.Valid;
import senai.com.ava_senai.domain.task.TaskRegisterDTO;
import senai.com.ava_senai.domain.task.TaskResponseDTO;
import senai.com.ava_senai.domain.task.TaskUpdateOrderDTO;
import senai.com.ava_senai.domain.task.TaskUserCourseMessage;

import java.util.List;

public interface ITaskService {

    TaskResponseDTO createTask(TaskRegisterDTO tasksRegister) throws Exception;

    void saveTaskUsersForCourse(TaskUserCourseMessage taskUserCourseMessage) throws Exception;

    TaskResponseDTO getTaskById(Long id) throws Exception;

    TaskResponseDTO updateTask(Long id, TaskRegisterDTO taskRegisterDTO) throws Exception;

    void updateTaskOrder(@Valid List<TaskUpdateOrderDTO> taskUpdateOrderDTOS) throws Exception;
}
