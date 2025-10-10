package senai.com.ava_senai.domain.task;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskUserCourseMessage {
    private Long taskId;
    private Long courseId;
}
