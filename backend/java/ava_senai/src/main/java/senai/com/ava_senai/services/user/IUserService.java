package senai.com.ava_senai.services.user;

import senai.com.ava_senai.domain.user.UserFinderDTO;
import senai.com.ava_senai.domain.user.UserRegisterDTO;
import senai.com.ava_senai.domain.user.UserResponseDTO;

import java.util.List;

public interface IUserService {


    UserResponseDTO getUserByid(Long id);

    List<UserResponseDTO> getAllUsers(UserFinderDTO userFinderDTO);

    UserResponseDTO createUser(UserRegisterDTO user);

    UserResponseDTO updateUser(UserRegisterDTO user, Long id);

    void deleteUser(Long id);


}
