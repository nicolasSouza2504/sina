package senai.com.ava_senai.services.task;

import senai.com.ava_senai.domain.task.TaskRegisterDTO;
import senai.com.ava_senai.domain.task.TaskResponseDTO;
import senai.com.ava_senai.domain.task.TaskUserCourseMessage;

import java.util.List;

public interface ITaskService {

    List<TaskResponseDTO> createTasks(List<TaskRegisterDTO> tasksRegister) throws Exception;

    void saveTaskUsersForCourse(TaskUserCourseMessage taskUserCourseMessage) throws Exception;

}
