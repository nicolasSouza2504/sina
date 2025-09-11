package senai.com.ava_senai.unit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import senai.com.ava_senai.domain.role.Role;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.domain.user.UserRegisterDTO;
import senai.com.ava_senai.domain.user.UserResponseDTO;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.exception.UserAlreadyExistsException;
import senai.com.ava_senai.exception.UserNotFoundException;
import senai.com.ava_senai.repository.UserRepository;
import senai.com.ava_senai.services.user.UserService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserRegisterDTO userRegisterDTO;
    private User user;

    @BeforeEach
    void setUp() {
        userRegisterDTO = new UserRegisterDTO("Test User", "testuser@example.com", "password123", "95566310036", null, new Role("USER"), null);
        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("testuser@example.com");
        user.setPassword("encodedPassword");
        user.setCpf("95566310036");
        Role role = new Role("USER");
        role.setId(3L);
        user.setRole(role);

    }

    @Test
    @DisplayName("Given userId when getUserById should return response data")
    void givenUserIdWhenGetUserByIdShouldReturnUserResponseDTO() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserResponseDTO response = userService.getUserByid(1L);

        assertNotNull(response);
        assertEquals(user.getId(), response.id());
        assertEquals(user.getEmail(), response.email());
        assertEquals(user.getName(), response.nome());
    }

    @Test
    @DisplayName("Given invalid userId when getUserById should throw UserNotFoundException")
    void givenInvalidUserIdWhenGetUserByIdShouldThrowUserNotFoundException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(UserNotFoundException.class, () -> userService.getUserByid(1L));

        assertEquals("Usuario não encontrado!", exception.getMessage());
    }

    @Test
    @DisplayName("Given users when getAllUsers should return list of UserResponseDTO")
    void givenUsersWhenGetAllUsersShouldReturnUserResponseDTOList() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        List<UserResponseDTO> users = userService.getAllUsers();

        assertNotNull(users);
        assertEquals(1, users.size());
        assertEquals(user.getId(), users.get(0).id());
    }

    @Test
    @DisplayName("Given no users when getAllUsers should throw NullListException")
    void givenNoUsersWhenGetAllUsersThenThrowNullListException() {
        when(userRepository.findAll()).thenReturn(List.of());

        Exception exception = assertThrows(NullListException.class, () -> userService.getAllUsers());

        assertEquals("Lista de Usuarios Vazia", exception.getMessage());
    }

    @Test
    @DisplayName("Given user register when createUser should return UserResponseDTO")
    void givenUserRegisterWhenCreateUserShouldReturnUserResponseDTO() {
        when(userRepository.existsByEmail(userRegisterDTO.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(userRegisterDTO.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponseDTO response = userService.createUser(userRegisterDTO);

        assertNotNull(response);
        assertEquals(user.getId(), response.id());
        assertEquals(user.getEmail(), response.email());
        assertEquals(user.getName(), response.nome());
    }

    @Test
    @DisplayName("Given existing email when createUser should throw UserAlreadyExistsException")
    void givenExistingEmailWhenCreateUserShouldThrowUserAlreadyExistsException() {
        when(userRepository.existsByEmail(userRegisterDTO.getEmail())).thenReturn(true);

        Exception exception = assertThrows(UserAlreadyExistsException.class, () -> userService.createUser(userRegisterDTO));

        assertEquals("Oops! User already exists!", exception.getMessage());
    }

    @Test
    @DisplayName("Given user register and userId when updateUser should return UserResponseDTO")
    void givenUserRegisterAndUserIdWhenUpdateUserShouldReturnUserResponseDTO() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(userRegisterDTO.getPassword())).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponseDTO response = userService.updateUser(userRegisterDTO, 1L);

        assertNotNull(response);
        assertEquals(user.getId(), response.id());
        assertEquals(user.getEmail(), response.email());
        assertEquals(user.getName(), response.nome());
    }

    @Test
    @DisplayName("Given invalid userId when updateUser should throw UserNotFoundException")
    void givenInvalidUserIdWhenUpdateUserThenThrowUserNotFoundException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(UserNotFoundException.class, () -> userService.updateUser(userRegisterDTO, 1L));

        assertEquals("Usuario não existe!", exception.getMessage());
    }

    @Test
    @DisplayName("Given updated email when updateUser should throw UserAlreadyExistsException")
    void givenUpdatedEmailWhenUpdateUserThenThrowUserAlreadyExistsException() {

        userRegisterDTO.setEmail("newEmail@gmail.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail(userRegisterDTO.getEmail())).thenReturn(true);

        Exception exception = assertThrows(UserAlreadyExistsException.class, () -> userService.updateUser(userRegisterDTO, 1L));

        assertEquals("Já existe um usuário com este email", exception.getMessage());

    }

}
