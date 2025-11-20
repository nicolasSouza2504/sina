package senai.com.ava_senai.domain.ranking;

import lombok.Data;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.feedback.Feedback;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;

@Data
public class TaskRankingCalculatorDTO {

    private Task task;
    private UserResponse userResponse;
    private Feedback feedback;

    public TaskRankingCalculatorDTO(Task task, UserResponse userResponse, Feedback feedback) {
        this.task = task;
        this.userResponse = userResponse;
        this.feedback = feedback;
    }

}
