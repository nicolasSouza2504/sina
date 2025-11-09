package senai.com.ava_senai.services.task;

import senai.com.ava_senai.domain.task.taskuser.TaskUserResponseSummaryDTO;

public interface ITaskUserService {

    public TaskUserResponseSummaryDTO getUserTaskByUserAndTaskId(Long userId, Long taskId);

}
