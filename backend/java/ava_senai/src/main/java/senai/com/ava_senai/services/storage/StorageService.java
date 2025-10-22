package senai.com.ava_senai.services.storage;

import io.minio.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageService {
    private final MinioClient minioClient;

    private static final String TASK_CONTENT_BUCKET = "task-contents";

    private void createBucketIfNotExists(String bucketName) throws Exception {

        boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

        if (!exists) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }

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

    public byte[] downloadTaskContent(String objectKey) {
        try {
            GetObjectResponse response = minioClient.getObject(
                GetObjectArgs.builder()
                    .bucket(TASK_CONTENT_BUCKET)
                    .object(objectKey)
                    .build()
            );
            return response.readAllBytes();
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file", e);
        }
    }
}
