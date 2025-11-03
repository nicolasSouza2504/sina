package senai.com.ava_senai.domain.user;

import senai.com.ava_senai.taskuser.TaskUser;

import java.util.Date;
import java.util.List;

public record UserContentSummaryDTO(Long id, String name, String email, List<TaskSummaryDTO> tasks) {

    record TaskSummaryDTO(Long id, String name, String description, Date dueDate) {
        public TaskSummaryDTO(TaskUser taskUser) {
            this(
                    taskUser.getTask().getId(),
                    taskUser.getTask().getName(),
                    taskUser.getTask().getDescription(),
                    taskUser.getTask().getDueDate()
            );
        }
    }

    public UserContentSummaryDTO(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getTaskUsers() != null ?
                        user.getTaskUsers().stream()
                                .map(TaskSummaryDTO::new)
                                .toList()
                        : List.of()
        );
    }

}
