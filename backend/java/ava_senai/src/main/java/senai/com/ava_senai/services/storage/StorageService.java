package senai.com.ava_senai.services.storage;

import io.minio.*;
import io.minio.errors.MinioException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.dto.FileData;
import senai.com.ava_senai.services.task.TaskContentService;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageService {

    protected final MinioClient minioClient;

    private static final Logger logger = LoggerFactory.getLogger(TaskContentService.class);

    public void createBucketIfNotExists(String bucketName) throws Exception {

        boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

        if (!exists) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }

    }

    public String uploadContent(byte[] content, String contentType, String identifier, String bucketName) {

        try {

            createBucketIfNotExists(bucketName);

            String objectKey = generateObjectKey(identifier);

            try (InputStream inputStream = new ByteArrayInputStream(content)) {

                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(bucketName)
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

    public String generateObjectKey(String identifier) {
        return String.format("%s/%s", identifier, UUID.randomUUID());
    }

    public InputStream downloadContent(String objectKey, String bucketName) {

        try {

            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .build());

        } catch (Exception e) {
            throw new RuntimeException("Error accessing bucket", e);
        }

    }

    public void deleteContent(String contentUrl, String bucketName) {

        try {

            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(contentUrl)
                            .build()
            );

        } catch (Exception e) {
            throw new RuntimeException("Error deleting file", e);
        }

    }

    public FileData findContentByPath(String filePath, String bucket) throws Throwable {

        try {

            InputStream stream = downloadContent(filePath, bucket);

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
                                .bucket(bucket)
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
