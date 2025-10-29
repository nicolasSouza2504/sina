package senai.com.ava_senai.services.task;

import io.micrometer.common.util.StringUtils;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.StatObjectArgs;
import io.minio.errors.MinioException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.TaskContentResponseDTO;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentType;
import senai.com.ava_senai.dto.FileData;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.TaskContentRepository;
import senai.com.ava_senai.repository.TaskRepository;
import senai.com.ava_senai.services.storage.StorageService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskContentService implements ITaskContentService {

    private final TaskContentRepository taskContentRepository;
    private final StorageService storageService;
    private final TaskRepository taskRepository;
    private final MinioClient minioClient;

    @Value("${minio.endpoint}")
    private String minioEndpoint;

    private static final Logger logger = LoggerFactory.getLogger(TaskContentService.class);

    @Override
    public TaskContentResponseDTO saveTaskContent(TaskContentRegisterDTO taskContentRegisterDTO, MultipartFile file) throws IOException {

        validateMandatoryFields(taskContentRegisterDTO, file);

        TaskContent taskContent = createTaskContent(taskContentRegisterDTO);

        // Only upload file if content type is not LINK
        if (!TaskContentType.LINK.equals(taskContent.getContentType())) {
            uploadContent(taskContent, file);
        }

        return new TaskContentResponseDTO(taskContent);

    }

    private void validateMandatoryFields(TaskContentRegisterDTO taskContentRegisterDTO, MultipartFile file) {

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

        if (TaskContentType.LINK.equals(taskContentRegisterDTO.taskContentType()) && StringUtils.isBlank(taskContentRegisterDTO.link())) {
            validation.add("link", "Link do conteúdo é obrigatório para o tipo LINK");
        } else if (!TaskContentType.LINK.equals(taskContentRegisterDTO.taskContentType())) {
            if (file == null || file.isEmpty()) {
                validation.add("file", "Arquivo do conteúdo é obrigatório para o tipo " + taskContentRegisterDTO.taskContentType());
            }
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

        taskContent.setContentUrl(objectKey);

        taskContentRepository.save(taskContent);

    }

    public TaskContent createTaskContent(TaskContentRegisterDTO taskContentRegisterDTO) {

        TaskContent taskContent = new TaskContent();

        taskContent.setContentType(taskContentRegisterDTO.taskContentType());
        taskContent.setTaskId(taskContentRegisterDTO.taskId());
        taskContent.setName(taskContentRegisterDTO.name());

        if (StringUtils.isNotBlank(taskContentRegisterDTO.link())) {
            taskContent.setContentUrl(taskContentRegisterDTO.link());
        }

        return taskContentRepository.save(taskContent);

    }

    public FileData findContentByPathWithMetadata(String filePath) throws IOException {

        logger.info("Fetching file from MinIO. Bucket: {}, Object: {}", StorageService.TASK_CONTENT_BUCKET, filePath);

        if (filePath == null || filePath.isEmpty()) {
            throw new IllegalArgumentException("File path must not be empty");
        }

        try {

            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(StorageService.TASK_CONTENT_BUCKET)
                            .object(filePath)
                            .build()
            );

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();

            byte[] data = new byte[4096];

            int nRead;

            while ((nRead = stream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }

            buffer.flush();
            stream.close();

            byte[] fileBytes = buffer.toByteArray();

            logger.info("Fetched file size: {} bytes", fileBytes.length);

            if (fileBytes.length == 0) {
                throw new IOException("File is empty or could not be read from MinIO");
            }

            String mimeType = null;

            try {

                var stat = minioClient.statObject(
                        StatObjectArgs.builder()
                                .bucket(StorageService.TASK_CONTENT_BUCKET)
                                .object(filePath)
                                .build()
                );

                mimeType = stat.contentType();

            } catch (MinioException e) {
                logger.warn("Could not fetch MIME type from MinIO metadata, inferring from extension. Error: {}", e.getMessage());
                mimeType = inferMimeType(filePath);
            }

            return new FileData(fileBytes, mimeType);

        } catch (Exception e) {
            logger.error("Failed to fetch file from MinIO: {}", e.getMessage(), e);
            throw new IOException("Failed to fetch file from MinIO: " + e.getMessage(), e);
        }

    }

    private String inferMimeType(String filePath) {
        String ext = Optional.ofNullable(filePath)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(f.lastIndexOf('.') + 1))
                .orElse("");
        return switch (ext.toLowerCase()) {
            case "pdf" -> MediaType.APPLICATION_PDF_VALUE;
            case "mp4" -> "video/mp4";
            case "png" -> MediaType.IMAGE_PNG_VALUE;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG_VALUE;
            case "txt" -> MediaType.TEXT_PLAIN_VALUE;
            default -> MediaType.APPLICATION_OCTET_STREAM_VALUE;
        };
    }
}
