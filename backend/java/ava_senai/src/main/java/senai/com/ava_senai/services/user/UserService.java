package senai.com.ava_senai.services.user;


import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.domain.user.UserFinderDTO;
import senai.com.ava_senai.domain.user.UserRegisterDTO;
import senai.com.ava_senai.domain.user.UserResponseDTO;
import senai.com.ava_senai.domain.user.userclass.UserClass;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.exception.UserAlreadyExistsException;
import senai.com.ava_senai.exception.UserNotFoundException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.UserClassRepository;
import senai.com.ava_senai.repository.UserRepository;
import senai.com.ava_senai.util.CPFCNPJValidator;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserClassRepository userClassRepository;

    @Override
    public UserResponseDTO getUserByid(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario não encontrado!"));

        return new UserResponseDTO(user);

    }

    @Override
    public List<UserResponseDTO> getAllUsers(UserFinderDTO userFinderDTO) {

        List<UserResponseDTO> userList = userRepository.findAll(userFinderDTO.name(), userFinderDTO.role(), userFinderDTO.idClass(), userFinderDTO.idCourse()).stream().map(UserResponseDTO::new).toList();

        if (userList.isEmpty()) {
            throw new NullListException("Lista de Usuarios Vazia");
        }

        return userList;

    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public UserResponseDTO createUser(UserRegisterDTO request) {

        return Optional.of(request)
                .filter(user -> !userRepository.existsByEmail(request.getEmail()))
                .map(req -> {

                    validateMandatoryFields(request);

                    User user = buildUser(request);

                    user = userRepository.save(user);

                    saveImage(request.getImage(), user);
                    saveClasses(request, user);

                    return new UserResponseDTO(user);

                })
                .orElseThrow(() -> new UserAlreadyExistsException("Oops! User already exists!"));

    }


    public void saveClasses(UserRegisterDTO userRegisterDTO, User userDb) {

        if (userRegisterDTO.getClassesId() != null && !userRegisterDTO.getClassesId().isEmpty()) {

            userRegisterDTO.getClassesId().forEach(classId -> {
                userClassRepository.save(new UserClass(userDb.getId(), classId));
            });

        }

    }

    @Override
    public UserResponseDTO updateUser(UserRegisterDTO request, Long id) {

        validateMandatoryFields(request);

        return Optional.ofNullable(userRepository.findById(id))
                .get()
                .map((userDb) -> {

                    validateEmailUpdate(request, userDb);

                    updateData(request, userDb);

                    userRepository.save(userDb);

                    return new UserResponseDTO(userDb);

                })
                .orElseThrow(() -> new UserNotFoundException("Usuario não existe!"));

    }

    private void validateEmailUpdate(UserRegisterDTO userRequest, User userDb) {

        if (!userRequest.getEmail().equals(userDb.getEmail()) && userRepository.existsByEmail(userRequest.getEmail())) {
            throw new UserAlreadyExistsException("Já existe um usuário com este email");
        }

    }

    @Transactional
    public void validateMandatoryFields(UserRegisterDTO user) {

        Validation validation = new Validation();

        if (StringUtils.isBlank(user.getName())) {
            validation.add("Nome", "Informe o nome");
        }

        if (StringUtils.isBlank(user.getEmail())) {
            validation.add("Email", "Informe o email");
        }

        if (StringUtils.isBlank(user.getPassword())) {
            validation.add("Senha", "Informe a senha");
        }

        if (user.getRole() == null) {
            validation.add("Permissão", "Informe o nível de permissão do usuário");
        }

        if (StringUtils.isEmpty(user.getCpf()) || !CPFCNPJValidator.isValidCpf(user.getCpf())) {

            if (!isAdm(user)) {
                validation.add("CPF", "Informe um CPF válido");
            }

        }

        validation.throwIfHasErrors();

    }

    @Override
    public void deleteUser(Long id) {

    }

    private void updateData(UserRegisterDTO user, User userDb) {

        userDb.setEmail(user.getEmail());
        userDb.setName(user.getName());
        userDb.setPassword(passwordEncoder.encode(user.getPassword()));
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
        user.setIdInstitution(request.getIdInstitution());

        return user;

    }

    private Path getFilePath(User user, MultipartFile image) {

        String uniqueFileName = String.valueOf(user.getId()) + "." + FilenameUtils.getExtension(image.getOriginalFilename());

        return Path.of("src/main/resources/img/");

    }

    public void saveImage(MultipartFile image, User user) {

        try {

            if (image != null) {

                Path uploadPath = Path.of("src/main/resources/img/");
                Path filePath = getFilePath(user, image);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            }

        } catch (Throwable t) {
            t.printStackTrace();
        }

    }

    public Boolean isAdm(UserRegisterDTO userRegisterDTO) {
        return userRegisterDTO.getRole() != null && userRegisterDTO.getRole().getName().equalsIgnoreCase("ADMIN");
    }

}
