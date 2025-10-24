package senai.com.ava_senai.services.task;

import senai.com.ava_senai.domain.task.TaskRegisterDTO;
import senai.com.ava_senai.domain.task.TaskResponseDTO;
import senai.com.ava_senai.domain.task.TaskUserCourseMessage;

import java.util.List;

public interface ITaskService {

    TaskResponseDTO createTasks(TaskRegisterDTO tasksRegister) throws Exception;

    void saveTaskUsersForCourse(TaskUserCourseMessage taskUserCourseMessage) throws Exception;

    TaskResponseDTO getTaskById(Long id) throws Exception;
}
