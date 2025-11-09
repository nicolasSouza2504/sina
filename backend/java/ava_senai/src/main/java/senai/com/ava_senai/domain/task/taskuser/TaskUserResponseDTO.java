package senai.com.ava_senai.domain.task.taskuser;

public record TaskUserResponseDTO(Long idUser, Long taskId, Long id) {
    public TaskUserResponseDTO(TaskUser taskUser) {
        this(taskUser.getUserId(), taskUser.getTaskId(), taskUser.getId());
    }
}
