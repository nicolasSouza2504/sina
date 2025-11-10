package senai.com.ava_senai.services.task;

import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContentRegisterDTO;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContentResponseDTO;
import senai.com.ava_senai.dto.FileData;

import java.io.IOException;

public interface IUserResponseContentService {
    UserResponseContentResponseDTO saveUserResponseContent(UserResponseContentRegisterDTO userResponseContentRegisterDTO, MultipartFile file) throws IOException;
    void delete(Long id);

    FileData findContentByPath(String filePath) throws Throwable;
}
