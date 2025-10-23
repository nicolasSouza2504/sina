package senai.com.ava_senai.domain.task;

import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentType;

public record TaskContentResponseDTO(TaskContentType taskContentType, String name, String url) {

    public TaskContentResponseDTO(TaskContent taskContent) {
        this(taskContent.getContentType(), taskContent.getName(), taskContent.getContentUrl());
    }

}
