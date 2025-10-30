package senai.com.ava_senai.domain.user;

import senai.com.ava_senai.domain.course.clazz.ClassResponseDTO;
import senai.com.ava_senai.domain.user.role.Role;

import java.util.List;

public record UserResponseDTO(Long id, String email, String nome, UserStatus status, Role role, String institutionName, String cpf, List<ClassResponseDTO> classes) {
    public UserResponseDTO(User user ) {
        this(user.getId(), user.getEmail(), user.getName(), user.getUserStatus(), user.getRole(), user.getInstitution().getInstitutionName(),  user.getCpf(), user.getUserClasses() != null ? user.getUserClasses().stream().map((userClass) -> new ClassResponseDTO(userClass.getClassEntity())).toList() : null);
    }
}
