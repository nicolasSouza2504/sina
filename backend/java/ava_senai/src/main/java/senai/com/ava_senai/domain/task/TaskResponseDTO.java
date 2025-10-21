package senai.com.ava_senai.domain.task;

public record TaskResponseDTO(Long taskId, String taskName, String taskDescription) {

    public TaskResponseDTO(Task task) {
        this(task.getId(), task.getName(), task.getDescription());
    }

}
