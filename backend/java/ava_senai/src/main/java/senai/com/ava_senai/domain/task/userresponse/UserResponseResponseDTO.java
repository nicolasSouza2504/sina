package senai.com.ava_senai.domain.task.userresponse;

public record UserResponseResponseDTO(Long id, String comment) {
    public UserResponseResponseDTO(UserResponse taskResponse) {
        this(taskResponse.getId(), taskResponse.getComment());
    }
}
