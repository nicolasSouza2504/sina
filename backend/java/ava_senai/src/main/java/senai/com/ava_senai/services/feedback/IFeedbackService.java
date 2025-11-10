package senai.com.ava_senai.services.feedback;

import senai.com.ava_senai.domain.task.feedback.FeedbackRegisterDTO;
import senai.com.ava_senai.domain.task.feedback.FeedbackResponseDTO;

public interface IFeedbackService {

    FeedbackResponseDTO evaluate(FeedbackRegisterDTO feedbackRegisterDTO);

    FeedbackResponseDTO getByIdResponse(Long id);
}
