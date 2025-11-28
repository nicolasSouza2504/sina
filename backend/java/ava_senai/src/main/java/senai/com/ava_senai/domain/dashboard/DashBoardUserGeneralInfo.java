package senai.com.ava_senai.domain.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import senai.com.ava_senai.domain.task.TaskResponseDTO;

import java.util.List;

@Data
public class DashBoardUserGeneralInfo {
    List<TaskResponseDTO> waitingFeedbackTasks;
    List<TaskResponseDTO> pendingTasks;
    List<TaskResponseDTO> evaluatedTasks;
}
