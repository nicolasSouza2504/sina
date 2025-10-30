package senai.com.ava_senai.domain.user;

import senai.com.ava_senai.domain.user.role.Role;

public record UserJWTDTO(Long id, String email, String nome, UserStatus status, Role role, String institutionName,
        String cpf) {
    public UserJWTDTO(User user) {
        this(user.getId(), user.getEmail(), user.getName(), user.getUserStatus(), user.getRole(),
                user.getInstitution().getInstitutionName(), user.getCpf());
    }
}
