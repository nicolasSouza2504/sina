package senai.com.ava_senai.domain.course.clazz;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import senai.com.ava_senai.domain.user.UserStatus;
import senai.com.ava_senai.domain.user.role.Role;
import senai.com.ava_senai.domain.task.taskuser.TaskUserResponseSummaryDTO;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;

public record ClassResponseSummaryDTO(Long Id, String nome, LocalDate startDate, LocalDate finalDate, String imgClass,
        Integer semester, String code, CourseSimpleResponseDTO course, List<UserTaskResponse> users) {

    // Construtor sem buscar UserResponse (mantido para compatibilidade)
    public ClassResponseSummaryDTO(Class clazz) {
        this(clazz.getId(), clazz.getName(), clazz.getStartDate(), clazz.getEndDate(), clazz.getImgClass(),
                clazz.getSemester(), clazz.getCode(),
                new CourseSimpleResponseDTO(clazz),
                clazz.getUserClasses() != null ? clazz.getUserClasses().stream()
                        .map(userClass -> new UserTaskResponse(
                                userClass.getUser(),
                                userClass.getUser() != null && userClass.getUser().getTaskUsers() != null
                                        ? userClass.getUser().getTaskUsers().stream()
                                                .map(taskUser -> new TaskUserResponseSummaryDTO(taskUser, Optional.empty()))
                                                .collect(Collectors.toList())
                                        : List.of()))
                        .collect(Collectors.toList()) : List.of());
    }

    // Construtor que recebe a lista de UserResponse para popular corretamente
    public ClassResponseSummaryDTO(Class clazz, List<UserResponse> userResponses) {
        this(clazz.getId(), clazz.getName(), clazz.getStartDate(), clazz.getEndDate(), clazz.getImgClass(),
                clazz.getSemester(), clazz.getCode(),
                new CourseSimpleResponseDTO(clazz),
                clazz.getUserClasses() != null ? clazz.getUserClasses().stream()
                        .map(userClass -> new UserTaskResponse(
                                userClass.getUser(),
                                userClass.getUser() != null && userClass.getUser().getTaskUsers() != null
                                        ? userClass.getUser().getTaskUsers().stream()
                                                .map(taskUser -> {
                                                    // Busca o UserResponse correspondente ao TaskUser
                                                    Optional<UserResponse> userResponse = userResponses.stream()
                                                            .filter(ur -> ur.getTaskUserId().equals(taskUser.getId()))
                                                            .findFirst();
                                                    return new TaskUserResponseSummaryDTO(taskUser, userResponse);
                                                })
                                                .collect(Collectors.toList())
                                        : List.of()))
                        .collect(Collectors.toList()) : List.of());
    }

    public record CourseSimpleResponseDTO(Long id, String name) {

        public CourseSimpleResponseDTO(Class clazz) {
            this(clazz.getCourseId(), clazz.getCourse() != null ? clazz.getCourse().getName() : null);
        }

    }

    public record UserTaskResponse(Long id, String email, String nome, UserStatus status, Role role,
            String institutionName, String cpf, List<TaskUserResponseSummaryDTO> taskUser) {
        public UserTaskResponse(User user, List<TaskUserResponseSummaryDTO> taskUser) {
            this(user.getId(), user.getEmail(), user.getName(), user.getUserStatus(), user.getRole(),
                    user.getInstitution() != null ? user.getInstitution().getInstitutionName() : null, user.getCpf(),
                    taskUser);
        }
    }

}
