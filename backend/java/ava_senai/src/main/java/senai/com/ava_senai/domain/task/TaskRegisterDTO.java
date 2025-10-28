package senai.com.ava_senai.domain.task;

import java.util.Date;

public record TaskRegisterDTO(Long courseId, Long knowledgeTrailId, String name, String description, Dificuldade difficultyLevel, Date dueDate) {
}
