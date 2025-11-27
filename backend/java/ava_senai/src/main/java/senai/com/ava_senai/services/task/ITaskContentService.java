package senai.com.ava_senai.services.task;

import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentResponseDTO;

import java.io.IOException;

public interface ITaskContentService {
    TaskContentResponseDTO saveTaskContent(TaskContentRegisterDTO taskResponseContentRegisterDTO, MultipartFile file) throws IOException;
    void delete(Long id);
}
