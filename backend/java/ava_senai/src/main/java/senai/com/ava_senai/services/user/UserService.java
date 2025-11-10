package senai.com.ava_senai.services.user;

import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.course.Course;
import senai.com.ava_senai.domain.course.CourseContentSummaryDTO;
import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.domain.course.institution.Institution;
import senai.com.ava_senai.domain.user.*;
import senai.com.ava_senai.domain.user.userclass.UserClass;
import senai.com.ava_senai.exception.*;
import senai.com.ava_senai.repository.*;
import senai.com.ava_senai.services.task.TaskService;
import senai.com.ava_senai.util.CPFCNPJValidator;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserClassRepository userClassRepository;
    private final InstitutionRepository institutionRepository;
    private final ClassRepository classRepository;
    private final TaskService taskService;
    private final CourseRepository courseRepository;

    @Override
    public UserResponseDTO getUserByid(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario não encontrado!"));

        return new UserResponseDTO(user);

    }

    @Override
    public List<UserResponseDTO> getAllUsers(UserFinderDTO userFinderDTO) {

        List<UserResponseDTO> userList = userRepository
                .findAll(userFinderDTO.name(), userFinderDTO.role(), userFinderDTO.idClass(), userFinderDTO.idCourse())
                .stream().map(UserResponseDTO::new).toList();

        if (userList.isEmpty()) {
            throw new NullListException("Lista de Usuarios Vazia");
        }

        return userList;

    }

    // na hora que eu vou salvar um usuário, caso ele esteja em uma class devo
    // chamar a rotina de salvar tasks

    // sendMessageCreateUsersTask(task.getId(), taskRegister.courseId());

    @Override
    @Transactional(rollbackOn = Exception.class)
    public UserResponseDTO createUser(UserRegisterDTO request) {

        return Optional.of(request)
                .filter(user -> !userRepository.existsByEmail(request.getEmail()))
                .map(req -> {

                    validateMandatoryFields(request, 1);

                    User user = buildUser(request);

                    user = userRepository.save(user);

                    String imageName = saveImage(request.getImage(), user);

                    user.setNameImage(imageName);

                    userRepository.updateNameImageById(imageName, user.getId());

                    saveClasses(request, user);

                    return new UserResponseDTO(user);

                })
                .orElseThrow(() -> new UserAlreadyExistsException("Oops! User already exists!"));

    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(UserRegisterDTO request, Long id) {

        validateMandatoryFields(request, 2);

        return Optional.ofNullable(userRepository.findById(id))
                .get()
                .map((userDb) -> {

                    validateEmailUpdate(request, userDb);

                    updateData(request, userDb);

                    userRepository.save(userDb);

                    updateRelationedClasses(request, userDb);

                    return new UserResponseDTO(userDb);

                })
                .orElseThrow(() -> new UserNotFoundException("Usuario não existe!"));

    }

    @Override
    public CourseContentSummaryDTO getUserContentSummaryById(Long userId, Long courseId) {

        Course course = courseRepository.findCourseWithContentOfUserById(userId, courseId)
                .orElseThrow(
                        () -> new NotFoundException("Usuário sem acesso ao conteúdo deste curso ou curso não existe!"));

        return new CourseContentSummaryDTO(course);

    }

    @Override
    public UserResponseDTO changeUserStatus(Long userId, UserStatus status) {

        return Optional.ofNullable(userRepository.findById(userId))
                .get()
                .map((userDb) -> {

                    userDb.setUserStatus(status);

                    updateData(new UserRegisterDTO(userDb), userDb);

                    userRepository.save(userDb);

                    return new UserResponseDTO(userDb);

                })
                .orElseThrow(() -> new UserNotFoundException("Usuario não existe!"));

    }

    @Override
    public void deleteUser(Long id) {

    }

    public void updateRelationedClasses(UserRegisterDTO request, User userDb) {

        removeOldRelatedData(userDb);

        saveClasses(request, userDb);

    }

    private void removeOldRelatedData(User userDb) {

        List<UserClass> userClasses = userClassRepository.findUserClassByUserId(userDb.getId());

        if (!userClasses.isEmpty()) {

            userClasses.forEach(userClass -> {
                userClassRepository.deleteById(userClass.getId());
            });

        }

        userDb.getUserClasses().removeAll(userClasses);

    }

    private void validateEmailUpdate(UserRegisterDTO userRequest, User userDb) {

        if (!userRequest.getEmail().equals(userDb.getEmail()) && userRepository.existsByEmail(userRequest.getEmail())) {
            throw new UserAlreadyExistsException("Já existe um usuário com este email");
        }

    }

    @Transactional
    public void validateMandatoryFields(UserRegisterDTO user, Integer action) {

        Validation validation = new Validation();

        if (StringUtils.isBlank(user.getName())) {
            validation.add("Nome", "Informe o nome");
        }

        if (StringUtils.isBlank(user.getEmail())) {
            validation.add("Email", "Informe o email");
        }

        if (action == 1) {
            if (StringUtils.isBlank(user.getPassword())) {
                validation.add("Senha", "Informe a senha");
            }
        }

        if (user.getRole() == null) {
            validation.add("Permissão", "Informe o nível de permissão do usuário");
        }

        if (StringUtils.isEmpty(user.getCpf()) || !CPFCNPJValidator.isValidCpf(user.getCpf())) {

            if (!isAdm(user)) {
                validation.add("CPF", "Informe um CPF válido");
            }

        }

        if (user.getClassesId() != null && !user.getClassesId().isEmpty()) {

            user.getClassesId().forEach(classId -> {

                if (!classRepository.existsById(classId)) {
                    validation.add("Classe", "A classe com ID " + classId + " não existe");
                }

            });

        }

        validation.throwIfHasErrors();

    }

    private void updateData(UserRegisterDTO user, User userDb) {

        userDb.setEmail(user.getEmail());
        userDb.setName(user.getName());
        userDb.setPassword(
                user.getPassword() != null ? passwordEncoder.encode(user.getPassword()) : userDb.getPassword());
        userDb.setRole(user.getRole());
        userDb.setCpf(user.getCpf());

    }

    private User buildUser(UserRegisterDTO request) {

        User user = new User();

        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setCpf(request.getCpf());
        user.setUserStatus(UserStatus.ATIVO);
        Institution institution = institutionRepository.findById(request.getIdInstitution())
                .orElseThrow(() -> new NotFoundException("Instituicao nao encontrada!"));
        user.setInstitution(institution);
        user.setIdInstitution(request.getIdInstitution());

        return user;

    }

    private Path getFilePath(String uniqueFileName) {
        return Path.of("src/main/resources/img", uniqueFileName);
    }

    public String saveImage(MultipartFile image, User user) {

        String uniqueFileName = null;

        try {

            if (image != null && !image.isEmpty()) {

                Path uploadPath = Path.of("src/main/resources/img/");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                uniqueFileName = user.getId() + "." + FilenameUtils.getExtension(image.getOriginalFilename());

                Path filePath = getFilePath(uniqueFileName);

                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            }

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar imagem", e);
        }

        return uniqueFileName;

    }

    public Boolean isAdm(UserRegisterDTO userRegisterDTO) {
        return userRegisterDTO.getRole() != null && userRegisterDTO.getRole().getName().equalsIgnoreCase("ADMIN");
    }

    public void saveClasses(UserRegisterDTO userRegisterDTO, User userDb) {

        if (userRegisterDTO.getClassesId() != null && !userRegisterDTO.getClassesId().isEmpty()) {

            List coursesOfUser = new ArrayList<Long>();

            userRegisterDTO.getClassesId().forEach(classId -> {

                Class clazz = classRepository.findById(classId).get();

                UserClass userClass = userClassRepository.save(new UserClass(userDb, clazz));

                Long courseId = clazz.getCourseId();

                if (!coursesOfUser.contains(courseId)) {

                    createContentCourseForUser(courseId);

                    coursesOfUser.add(courseId);

                }

                if (userDb.getUserClasses() != null) {
                    userDb.getUserClasses().add(userClass);
                } else {

                    List<UserClass> userClasses = new ArrayList<>();

                    userClasses.add(userClass);

                    userDb.setUserClasses(userClasses);

                }

            });

        }

    }

    public void createContentCourseForUser(Long courseId) {

        List<Long> taskIds = courseRepository.findAllTaskIdsByCourseId(courseId);

        if (taskIds != null && !taskIds.isEmpty()) {

            taskIds.forEach(taskId -> {
                taskService.sendMessageCreateUsersTask(taskId, courseId);
            });

        }

    }

}
