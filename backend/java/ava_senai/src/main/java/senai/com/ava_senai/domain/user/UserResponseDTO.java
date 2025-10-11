package senai.com.ava_senai.domain.user;

import java.util.List;

public record UserResponseDTO(Long id, String email, String nome, UserStatus status, List<String> roles) {

public record UserResponseDTO(Long id, String email, String nome, Role role, String institutionName, String cpf, String userImage ) {
    public UserResponseDTO(User user ) {
        this(user.getId(), user.getEmail(), user.getName(), user.getRole(), user.getInstitution().getInstitutionName(),  user.getCpf(), user.getNameImage());
    }
}
