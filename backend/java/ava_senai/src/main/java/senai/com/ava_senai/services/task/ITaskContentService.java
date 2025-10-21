package senai.com.ava_senai.services.task;

import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.TaskContentResponseDTO;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;

import java.io.IOException;

public interface ITaskContentService {
    TaskContentResponseDTO saveTaskContent(TaskContentRegisterDTO taskContentRegisterDTO, MultipartFile file) throws IOException;
    void uploadContent(TaskContent taskContent, MultipartFile file) throws IOException;
}
