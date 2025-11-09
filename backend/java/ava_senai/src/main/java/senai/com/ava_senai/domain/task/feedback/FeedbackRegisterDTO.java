package senai.com.ava_senai.domain.task.feedback;

public record FeedbackRegisterDTO(Long userResponseId, Long teacherId, String comment, Double grade) {
}
