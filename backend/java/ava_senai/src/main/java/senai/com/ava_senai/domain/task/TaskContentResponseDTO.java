package senai.com.ava_senai.domain.task;

import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentType;

public record TaskContentResponseDTO(String identifier, TaskContentType taskContentType, TaskContentUploadStatus uploadStatus) {

    public TaskContentResponseDTO(TaskContent taskContent) {
        this(taskContent.getIdentifier(), taskContent.getContentType(), taskContent.getStatus());
    }

}
