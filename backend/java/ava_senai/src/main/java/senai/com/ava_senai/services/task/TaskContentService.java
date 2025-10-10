package senai.com.ava_senai.services.task;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.task.TaskContentUploadStatus;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentUploadDTO;
import senai.com.ava_senai.repository.TaskContentRepository;
import senai.com.ava_senai.services.storage.StorageService;

@Service
@RequiredArgsConstructor
public class TaskContentService {

    private final TaskContentRepository taskContentRepository;
    private final StorageService storageService;

    @Value("${minio.endpoint}")
    private String minioEndpoint;

    public void uploadContent(TaskContentUploadDTO uploadDTO) {

        TaskContent taskContent = taskContentRepository.findByIdentifier(uploadDTO.identifier())
            .orElseThrow(() -> new RuntimeException("Task content not found"));

        String objectKey = storageService.uploadTaskContent(
            uploadDTO.fileContent(),
            uploadDTO.contentType(),
            taskContent.getTask().getId().toString()
        );


        String contentUrl = String.format("%s/%s/%s", minioEndpoint, "task-contents", objectKey);

        taskContent.setContentUrl(contentUrl);
        taskContent.setStatus(TaskContentUploadStatus.COMPLETED);

        taskContentRepository.save(taskContent);

    }
}
