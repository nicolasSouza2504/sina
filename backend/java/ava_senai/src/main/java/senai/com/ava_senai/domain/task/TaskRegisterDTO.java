package senai.com.ava_senai.domain.task;

import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;

import java.util.List;

public record TaskRegisterDTO(Long courseId, Long knowledgeTrailId, String name, String description, List<TaskContentRegisterDTO> contents) {
}
