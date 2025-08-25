package senai.com.ava_senai.domain.user;

import java.util.List;

public record UserResponseData(Long id, String email, String nome, List<String> roles) {
    public UserResponseData(User user ) {
        this(user.getId(), user.getEmail(), user.getName(), List.of(user.getRole().getName()));
    }
}
