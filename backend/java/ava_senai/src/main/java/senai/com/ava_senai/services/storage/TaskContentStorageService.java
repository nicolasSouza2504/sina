package senai.com.ava_senai.services.storage;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.UUID;

@Service
public class TaskContentStorageService extends StorageService {

    public static final String TASK_CONTENT_BUCKET = "task-contents";

    public TaskContentStorageService(MinioClient minioClient) {
        super(minioClient);
    }

    public String uploadTaskContent(byte[] content, String contentType, String taskId) {

        try {

            createBucketIfNotExists(TASK_CONTENT_BUCKET);

            String objectKey = generateObjectKey(taskId);

            try (InputStream inputStream = new ByteArrayInputStream(content)) {

                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(TASK_CONTENT_BUCKET)
                                .object(objectKey)
                                .stream(inputStream, content.length, -1)
                                .contentType(contentType)
                                .build()
                );

                return objectKey;

            }

        } catch (Exception e) {
            throw new RuntimeException("Error uploading file", e);
        }

    }

    private String generateObjectKey(String taskId) {
        return String.format("%s/%s", taskId, UUID.randomUUID());
    }

    public InputStream downloadTaskContent(String objectKey) {

        try {

            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(TASK_CONTENT_BUCKET)
                            .object(objectKey)
                            .build());

        } catch (Exception e) {
            throw new RuntimeException("Error accessing bucket", e);
        }

    }

    public void deleteTaskContent(String contentUrl) {

        try {

            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(TASK_CONTENT_BUCKET)
                            .object(contentUrl)
                            .build()
            );

        } catch (Exception e) {
            throw new RuntimeException("Error deleting file", e);
        }

    }


}
