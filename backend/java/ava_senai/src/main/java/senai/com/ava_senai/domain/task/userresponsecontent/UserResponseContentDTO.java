package senai.com.ava_senai.domain.task.userresponsecontent;

import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentType;

public record UserResponseContentDTO(TaskContentType taskContentType, String name, String url) {

    public UserResponseContentDTO(TaskContent taskContent) {
        this(taskContent.getContentType(), taskContent.getName(), taskContent.getContentUrl());
    }

}

