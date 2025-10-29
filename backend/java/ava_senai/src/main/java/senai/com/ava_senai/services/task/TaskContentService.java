package senai.com.ava_senai.services.task;

import io.micrometer.common.util.StringUtils;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.TaskContentResponseDTO;
import senai.com.ava_senai.domain.task.TaskContentUploadStatus;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentType;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentUploadDTO;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.TaskContentRepository;
import senai.com.ava_senai.repository.TaskRepository;
import senai.com.ava_senai.services.storage.StorageService;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class TaskContentService implements ITaskContentService {

    private final TaskContentRepository taskContentRepository;
    private final StorageService storageService;
    private final TaskRepository taskRepository;

    @Value("${minio.endpoint}")
    private String minioEndpoint;

    @Override
    public TaskContentResponseDTO saveTaskContent(TaskContentRegisterDTO taskContentRegisterDTO, MultipartFile file) throws IOException {

        validateMandatoryFields(taskContentRegisterDTO);

        TaskContent taskContent = createTaskContent(taskContentRegisterDTO);

        uploadContent(taskContent, file);

        return new TaskContentResponseDTO(taskContent);

    }

    private void validateMandatoryFields(TaskContentRegisterDTO taskContentRegisterDTO) {

        Validation validation = new Validation();

        if (StringUtils.isEmpty(taskContentRegisterDTO.name())) {
            validation.add("name", "Nome do conteúdo é obrigatório");
        }

        if (taskContentRegisterDTO.taskId() == null) {
            validation.add("taskId", "Tarefa associada ao conteúdo é obrigatória");
        } else if (!taskRepository.existsById(taskContentRegisterDTO.taskId())) {
            validation.add("taskId", "Tarefa associada ao conteúdo não existe");
        }

        if (taskContentRegisterDTO.taskContentType() == null) {
            validation.add("taskContentType", "Content type do arquivo é obrigatório");
        }

        validation.throwIfHasErrors();

    }

    @Override
    public void uploadContent(TaskContent taskContent, MultipartFile file) throws IOException {

        String objectKey = storageService.uploadTaskContent(
            file.getBytes(),
            file.getContentType(),
            taskContent.getTaskId().toString()
        );

        String contentUrl = String.format("%s/%s/%s", minioEndpoint, StorageService.TASK_CONTENT_BUCKET, objectKey);

        taskContent.setContentUrl(contentUrl);

        taskContentRepository.save(taskContent);

    }

    public TaskContent createTaskContent(TaskContentRegisterDTO taskContentRegisterDTO) {

        TaskContent taskContent = new TaskContent();

        taskContent.setContentType(taskContentRegisterDTO.taskContentType());
        taskContent.setTaskId(taskContentRegisterDTO.taskId());
        taskContent.setName(taskContentRegisterDTO.name());

        return taskContentRepository.save(taskContent);

    }

}
