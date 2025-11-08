package senai.com.ava_senai.services.task;

import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentType;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContent;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContentRegisterDTO;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContentResponseDTO;
import senai.com.ava_senai.dto.FileData;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.UserResponseContentRepository;
import senai.com.ava_senai.repository.UserResponseRepository;
import senai.com.ava_senai.services.storage.StorageService;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserResponseContentService implements IUserResponseContentService {

    private static final String USER_RESPONSE_CONTENT_BUCKET = "user-response-contents";

    private final StorageService storageService;
    private final UserResponseContentRepository userResponseContentRepository;
    private final Logger logger = LoggerFactory.getLogger(UserResponseContentService.class);
    private final UserResponseRepository userResponseRepository;

    @Override
    public UserResponseContentResponseDTO saveUserResponseContent(UserResponseContentRegisterDTO userResponseContentRegisterDTO, MultipartFile file) throws IOException {

        validateMandatoryFields(userResponseContentRegisterDTO, file);

        UserResponseContent userResponseContent = createUserResponseContent(userResponseContentRegisterDTO);

        // Only upload file if content type is not LINK
        if (!TaskContentType.LINK.equals(userResponseContentRegisterDTO.contentType())) {
            uploadContent(userResponseContent, file);
        }

        return new UserResponseContentResponseDTO(userResponseContent);

    }

    @Override
    public void delete(Long id) {

        UserResponseContent userResponseContent = userResponseContentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Conteúdo da tarefa não encontrado"));

        // Delete from storage
        if (userResponseContent.getContentUrl() != null) {
            storageService.deleteContent(userResponseContent.getContentUrl(), USER_RESPONSE_CONTENT_BUCKET);
        }

        userResponseContentRepository.delete(userResponseContent);

    }

    @Override
    public FileData findContentByPath(String filePath) throws Throwable {

        logger.info("Fetching file from MinIO. Bucket: {}, Object: {}", USER_RESPONSE_CONTENT_BUCKET, filePath);

        if (filePath == null || filePath.isEmpty()) {
            throw new IllegalArgumentException("File path must not be empty");
        }

        return storageService.findContentByPath(filePath, USER_RESPONSE_CONTENT_BUCKET);

    }

    private UserResponseContent createUserResponseContent(UserResponseContentRegisterDTO userResponseContentRegisterDTO) {

        UserResponseContent userResponseContent = new UserResponseContent();

        userResponseContent.setContentType(userResponseContentRegisterDTO.contentType());
        userResponseContent.setUserResponseId(userResponseContentRegisterDTO.userResponseId());
        userResponseContent.setName(userResponseContentRegisterDTO.name());

        return userResponseContentRepository.save(userResponseContent);


    }

    private void validateMandatoryFields(UserResponseContentRegisterDTO userResponseContentRegisterDTO, MultipartFile file) {

        Validation validation = new Validation();

        if (StringUtils.isEmpty(userResponseContentRegisterDTO.name())) {
            validation.add("name", "Nome do conteúdo é obrigatório");
        }

        if (userResponseContentRegisterDTO.userResponseId() == null) {
            validation.add("userResponseId", "Resposta associada ao conteúdo é obrigatória");
        } else if (!userResponseRepository.existsById(userResponseContentRegisterDTO.userResponseId())) {
            validation.add("userResponseId", "Resposta associada ao conteúdo não existe");
        }

        if (userResponseContentRegisterDTO.contentType() == null) {
            validation.add("taskContentType", "Content type do arquivo é obrigatório");
        }

        if (TaskContentType.LINK.equals(userResponseContentRegisterDTO.contentType()) && StringUtils.isBlank(userResponseContentRegisterDTO.link())) {
            validation.add("link", "Link do conteúdo é obrigatório para o tipo LINK");
        } else if (!TaskContentType.LINK.equals(userResponseContentRegisterDTO.contentType())) {

            if (file == null || file.isEmpty()) {
                validation.add("file", "Arquivo do conteúdo é obrigatório para o tipo " + userResponseContentRegisterDTO.contentType());
            }

        }

        validation.throwIfHasErrors();


    }

    public void uploadContent(UserResponseContent userResponseContent, MultipartFile file) throws IOException {

        String objectKey = storageService.uploadContent(
                file.getBytes(),
                file.getContentType(),
                userResponseContent.getUserResponseId().toString(),
                USER_RESPONSE_CONTENT_BUCKET
        );

        userResponseContent.setContentUrl(objectKey);

        userResponseContentRepository.save(userResponseContent);

    }

}
