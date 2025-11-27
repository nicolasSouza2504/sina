package senai.com.ava_senai.services.user;

import jakarta.validation.Valid;
import senai.com.ava_senai.domain.course.CourseContentSummaryDTO;
import senai.com.ava_senai.domain.user.UserFinderDTO;
import senai.com.ava_senai.domain.user.UserRegisterDTO;
import senai.com.ava_senai.domain.user.UserResponseDTO;
import senai.com.ava_senai.domain.user.UserStatus;

import java.util.List;

public interface IUserService {


    UserResponseDTO getUserByid(Long id);

    List<UserResponseDTO> getAllUsers(UserFinderDTO userFinderDTO);

    UserResponseDTO createUser(UserRegisterDTO user);

    UserResponseDTO updateUser(UserRegisterDTO user, Long id);

    void deleteUser(Long id);

    UserResponseDTO changeUserStatus(Long userId, UserStatus status);

    CourseContentSummaryDTO getUserContentSummaryById(@Valid Long userId, @Valid Long courseId);

}
