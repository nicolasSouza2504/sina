package senai.com.ava_senai.domain.user;

import senai.com.ava_senai.domain.course.institution.Institution;
import senai.com.ava_senai.domain.user.role.Role;


public record UserResponseDTO(Long id, String email, String nome, Role role, String institutionName, String cpf ) {
    public UserResponseDTO(User user ) {
        this(user.getId(), user.getEmail(), user.getName(), user.getRole(), user.getInstitution().getInstitutionName(),  user.getCpf());
    }
}
