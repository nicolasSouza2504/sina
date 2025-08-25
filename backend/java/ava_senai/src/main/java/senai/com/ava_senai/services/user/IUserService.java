package senai.com.ava_senai.services.user;

import senai.com.ava_senai.domain.user.UserRegisterDTO;
import senai.com.ava_senai.domain.user.UserResponseData;

import java.util.List;

public interface IUserService {


    UserResponseData getUserByid(Long id);

    List<UserResponseData> getAllUsers();

    UserResponseData createUser(UserRegisterDTO user);

    UserResponseData updateUser(UserRegisterDTO user, Long id);

    void deleteUser(Long id);


}
