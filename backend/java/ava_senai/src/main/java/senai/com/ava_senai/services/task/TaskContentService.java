package senai.com.ava_senai.services.task;

import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentResponseDTO;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentType;
import senai.com.ava_senai.dto.FileData;
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
    public static final String TASK_CONTENT_BUCKET = "task-contents";


    @Value("${minio.endpoint}")
    private String minioEndpoint;

    private static final Logger logger = LoggerFactory.getLogger(TaskContentService.class);

    @Override
    public TaskContentResponseDTO saveTaskContent(TaskContentRegisterDTO taskResponseContentRegisterDTO, MultipartFile file) throws IOException {

        validateMandatoryFields(taskResponseContentRegisterDTO, file);

        TaskContent taskContent = createTaskContent(taskResponseContentRegisterDTO);

        // Only upload file if content type is not LINK
        if (!TaskContentType.LINK.equals(taskContent.getContentType())) {
            uploadContent(taskContent, file);
        }

        return new TaskContentResponseDTO(taskContent);

    }

    private void validateMandatoryFields(TaskContentRegisterDTO userResponseContentRegisterDTO, MultipartFile file) {

        Validation validation = new Validation();

        if (StringUtils.isEmpty(userResponseContentRegisterDTO.name())) {
            validation.add("name", "Nome do conteúdo é obrigatório");
        }

        if (userResponseContentRegisterDTO.taskId() == null) {
            validation.add("taskId", "Tarefa associada ao conteúdo é obrigatória");
        } else if (!taskRepository.existsById(userResponseContentRegisterDTO.taskId())) {
            validation.add("taskId", "Tarefa associada ao conteúdo não existe");
        }

        if (userResponseContentRegisterDTO.taskContentType() == null) {
            validation.add("taskContentType", "Content type do arquivo é obrigatório");
        }

        if (TaskContentType.LINK.equals(userResponseContentRegisterDTO.taskContentType()) && StringUtils.isBlank(userResponseContentRegisterDTO.link())) {
            validation.add("link", "Link do conteúdo é obrigatório para o tipo LINK");
        } else if (!TaskContentType.LINK.equals(userResponseContentRegisterDTO.taskContentType())) {

            if (file == null || file.isEmpty()) {
                validation.add("file", "Arquivo do conteúdo é obrigatório para o tipo " + userResponseContentRegisterDTO.taskContentType());
            }

        }

        validation.throwIfHasErrors();

    }

    public void uploadContent(TaskContent taskContent, MultipartFile file) throws IOException {

        String objectKey = storageService.uploadContent(
                file.getBytes(),
                file.getContentType(),
                taskContent.getTaskId().toString(),
                TASK_CONTENT_BUCKET
        );

        taskContent.setContentUrl(objectKey);

        taskContentRepository.save(taskContent);

    }

    @Override
    public void delete(Long id) {

        TaskContent taskContent = taskContentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Conteúdo da tarefa não encontrado"));

        // Delete from storage
        if (taskContent.getContentUrl() != null) {
            storageService.deleteContent(taskContent.getContentUrl(), TASK_CONTENT_BUCKET);
        }

        taskContentRepository.delete(taskContent);

    }

    public TaskContent createTaskContent(TaskContentRegisterDTO taskResponseContentRegisterDTO) {

        TaskContent taskContent = new TaskContent();

        taskContent.setContentType(taskResponseContentRegisterDTO.taskContentType());
        taskContent.setTaskId(taskResponseContentRegisterDTO.taskId());
        taskContent.setName(taskResponseContentRegisterDTO.name());

        if (StringUtils.isNotBlank(taskResponseContentRegisterDTO.link())) {
            taskContent.setContentUrl(taskResponseContentRegisterDTO.link());
        }

        return taskContentRepository.save(taskContent);

    }

    public FileData findContentByPath(String filePath) throws Throwable {

        logger.info("Fetching file from MinIO. Bucket: {}, Object: {}", TASK_CONTENT_BUCKET, filePath);

        if (filePath == null || filePath.isEmpty()) {
            throw new IllegalArgumentException("File path must not be empty");
        }

        return storageService.findContentByPath(filePath, TASK_CONTENT_BUCKET);

    }

}
