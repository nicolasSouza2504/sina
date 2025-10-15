package senai.com.ava_senai.domain.task.taskcontent;

public record TaskContentUploadDTO(
    String identifier,
    byte[] fileContent,
    String contentType
) {}
