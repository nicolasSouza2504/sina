package senai.com.ava_senai.domain.task.userresponsecontent;

import senai.com.ava_senai.domain.task.taskcontent.TaskContentType;

public record UserResponseContentResponseDTO(TaskContentType taskContentType, String name, String url) {

    public UserResponseContentResponseDTO(UserResponseContent userResponseContent) {
        this(userResponseContent.getContentType(), userResponseContent.getName(), userResponseContent.getContentUrl());
    }

}

