package senai.com.ava_senai.services.task;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.domain.task.userresponse.UserResponseRegisterDTO;
import senai.com.ava_senai.domain.task.userresponse.UserResponseResponseDTO;
import senai.com.ava_senai.domain.task.userresponse.UserResponseSummaryDTO;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContent;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.TaskUserRepository;
import senai.com.ava_senai.repository.UserResponseContentRepository;
import senai.com.ava_senai.repository.UserResponseRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserResponseService implements IUserResponseService {

    private final TaskUserRepository taskUserRepository;
    private final UserResponseRepository userResponseRepository;
    private final UserResponseContentRepository userResponseContentRepository;
    private final UserResponseContentService userResponseContentService;

    @Override
    public UserResponseResponseDTO createUserResponse(UserResponseRegisterDTO userResponseRegisterDTO) {

        validateMandatoryFields(userResponseRegisterDTO);

        UserResponse userResponse = create(userResponseRegisterDTO);

        userResponseRepository.save(userResponse);

        return new UserResponseResponseDTO(userResponse);

    }

    @Override
    public UserResponseResponseDTO getUserResponseById(Long id) {

        UserResponse userResponse = userResponseRepository.findById(id).orElseThrow(() -> new NotFoundException("Resposta da tarefa não encontrada"));

        return new UserResponseResponseDTO(userResponse);

    }

    @Override
    public void deleteUserResponse(Long idUserResponse) {

        deleteUserResponseContents(idUserResponse);

        userResponseRepository.deleteById(idUserResponse);

    }

    @Override
    public UserResponseSummaryDTO getUserResponseSummaryById(Long id) {

        UserResponse userResponse = userResponseRepository.findSummaryById(id)
                                                          .orElseThrow(() -> new NotFoundException("Resposta da tarefa não encontrada"));

        return new UserResponseSummaryDTO(userResponse);

    }

    private void validateMandatoryFields(UserResponseRegisterDTO userResponseRegisterDTO) {

        Validation validation = new Validation();

        if (userResponseRegisterDTO.taskUserId() == null) {
            validation.add("taskUser", "Usuario da tarefa é obrigatório");
        } else if (!taskUserRepository.existsById(userResponseRegisterDTO.taskUserId())) {
            validation.add("taskUser", "Usuario da tarefa não encontrado");
        }

        if (userResponseRepository.existsUserResponsesByTaskUserId(userResponseRegisterDTO.taskUserId())) {
            validation.add("userResponse", "Já existe uma resposta para esse usuário da tarefa");
        }

        validation.throwIfHasErrors();

    }

    private UserResponse create(UserResponseRegisterDTO userResponseRegisterDTO) {
        return new UserResponse(userResponseRegisterDTO.taskUserId(), userResponseRegisterDTO.commentary());
    }

    public void deleteUserResponseContents(Long idUserResponse) {

        List<UserResponseContent> lsContents = userResponseContentRepository.findByUserResponseId(idUserResponse);

        if (!lsContents.isEmpty()) {

            lsContents.forEach(content -> {
                userResponseContentService.delete(content.getId());
            });

        }

    }

}
