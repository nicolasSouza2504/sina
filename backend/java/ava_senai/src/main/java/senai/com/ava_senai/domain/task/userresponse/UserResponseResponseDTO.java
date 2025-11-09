package senai.com.ava_senai.domain.task.userresponse;

public record UserResponseResponseDTO(Long id, String comment) {
    public UserResponseResponseDTO(UserResponse userResponse) {
        this(userResponse.getId(), userResponse.getComment());
    }
}
