package senai.com.ava_senai.services.task;

import jakarta.validation.Valid;
import senai.com.ava_senai.domain.task.userresponse.UserResponseRegisterDTO;
import senai.com.ava_senai.domain.task.userresponse.UserResponseResponseDTO;
import senai.com.ava_senai.domain.task.userresponse.UserResponseSummaryDTO;

public interface IUserResponseService {

    UserResponseResponseDTO createUserResponse(UserResponseRegisterDTO userResponseRegisterDTO) throws Exception;

    UserResponseResponseDTO getUserResponseById(Long id) throws Exception;

    void deleteUserResponse(@Valid Long id);

    UserResponseSummaryDTO getUserResponseSummaryById(Long id);

}
