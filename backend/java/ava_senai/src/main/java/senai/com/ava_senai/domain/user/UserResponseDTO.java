package senai.com.ava_senai.domain.user;

import java.util.List;

public record UserResponseDTO(Long id, String email, String nome, UserStatus status, List<String> roles) {
    public UserResponseDTO(User user ) {
        this(user.getId(), user.getEmail(), user.getName(), user.getUserStatus(), List.of(user.getRole().getName()));
    }
}
