package senai.com.ava_senai.domain.task.taskcontent;

public record TaskContentResponseDTO(TaskContentType taskContentType, String name, String url) {

    public TaskContentResponseDTO(TaskContent taskContent) {
        this(taskContent.getContentType(), taskContent.getName(), taskContent.getContentUrl());
    }

}
