package senai.com.ava_senai.services.user;

import jakarta.validation.Valid;
import senai.com.ava_senai.domain.user.*;

import java.util.List;

public interface IUserService {


    UserResponseDTO getUserByid(Long id);

    List<UserResponseDTO> getAllUsers(UserFinderDTO userFinderDTO);

    UserResponseDTO createUser(UserRegisterDTO user);

    UserResponseDTO updateUser(UserRegisterDTO user, Long id);

    void deleteUser(Long id);

    UserResponseDTO changeUserStatus(Long userId, UserStatus status);

    UserContentSummaryDTO getUserContentSummaryById(@Valid Long id);
}
