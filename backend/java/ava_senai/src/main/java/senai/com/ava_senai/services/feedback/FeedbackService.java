package senai.com.ava_senai.services.feedback;

import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.task.feedback.Feedback;
import senai.com.ava_senai.domain.task.feedback.FeedbackRegisterDTO;
import senai.com.ava_senai.domain.task.feedback.FeedbackResponseDTO;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.FeedbackRepository;
import senai.com.ava_senai.repository.KnowledgeTrailRepository;
import senai.com.ava_senai.repository.UserRepository;
import senai.com.ava_senai.repository.UserResponseRepository;
import senai.com.ava_senai.services.task.UserResponseService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeedbackService implements IFeedbackService{

    private final FeedbackRepository feedbackRepository;
    private final UserResponseRepository userResponseRepository;
    private final UserRepository userRepository;
    private final KnowledgeTrailRepository knowledgeTrailRepository;

    @Override
    public FeedbackResponseDTO evaluate(FeedbackRegisterDTO feedbackRegisterDTO) {

        validateEvaluation(feedbackRegisterDTO);

        Feedback feedback = createFeedback(feedbackRegisterDTO);

        return new FeedbackResponseDTO(feedback);
        
    }

    @Override
    public FeedbackResponseDTO getByIdResponse(Long id) {

        Feedback feedback = feedbackRepository.findByUserResponseId(id)
                .orElseThrow(() -> new NotFoundException("Feedback não encontrado para a resposta"));

        return new FeedbackResponseDTO(feedback);

    }

    private Feedback createFeedback(FeedbackRegisterDTO feedbackRegisterDTO) {

        Feedback feedback = new Feedback();

        UserResponse userResponse = userResponseRepository.findById(feedbackRegisterDTO.userResponseId()).get();
        User teacher = userRepository.findById(feedbackRegisterDTO.teacherId()).get();

        feedback.setUserResponse(userResponse);
        feedback.setTeacher(teacher);
        feedback.setComment(feedbackRegisterDTO.comment());
        feedback.setGrade(feedbackRegisterDTO.grade());

        return feedbackRepository.save(feedback);

    }

    private void validateEvaluation(FeedbackRegisterDTO feedbackRegisterDTO) {

        Validation validation = new Validation();

        if (StringUtils.isEmpty(feedbackRegisterDTO.comment())) {
            validation.add("Comentário", "Comentário é obrigatório.");
        }

        validateTeacher(validation, feedbackRegisterDTO);

        validateRulesResponseFeedback(validation, feedbackRegisterDTO);

        validation.throwIfHasErrors();

    }

    private void validateRulesResponseFeedback(Validation validation, FeedbackRegisterDTO feedbackRegisterDTO) {

        if (feedbackRegisterDTO.userResponseId() == null) {
            validation.add("Resposta", "Resposta do usuário é obrigatória.");
        } else if(!userResponseRepository.existsById(feedbackRegisterDTO.userResponseId())) {
            validation.add("Resposta", "Resposta do usuário não encontrada.");
        } else {

            Optional<Feedback> existentFeedbackOpt = feedbackRepository.findByUserResponseId(feedbackRegisterDTO.userResponseId());

            if (existentFeedbackOpt.isPresent()) {

                Feedback existentFeedback = existentFeedbackOpt.get();

                validation.add("Feedback", "Professor " + existentFeedback.getTeacher().getName() + " já avaliou essa resposta.");

            } else if (needsGrade(feedbackRegisterDTO)) {

                if (feedbackRegisterDTO.grade() == null) {
                    validation.add("Nota", "Nota é obrigatória para tarefa em uma trilha rankeada.");
                } else if (feedbackRegisterDTO.grade() < 0 || feedbackRegisterDTO.grade() > 10) {
                    validation.add("Nota", "Nota deve estar entre 0 e 10 para tarefa em uma trilha rankeada.");
                }

            }

        }

    }

    private void validateTeacher(Validation validation, FeedbackRegisterDTO feedbackRegisterDTO) {

        if (feedbackRegisterDTO.teacherId() == null) {
            validation.add("Professor", "Professor é obrigatório.");
        } else {

            Optional<User> userOpt = userRepository.findById(feedbackRegisterDTO.teacherId());

            if (userOpt.isPresent()) {

                User user = userOpt.get();

                if (user.getRole() == null || !"TEACHER".equalsIgnoreCase(user.getRole().getName())) {
                    validation.add("Professor", "Usuário não é um professor.");
                }

            } else {
                validation.add("Professor", "Professor não encontrado.");
            }

        }

    }

    private Boolean needsGrade(FeedbackRegisterDTO feedbackRegisterDTO) {

        KnowledgeTrail knowledgeTrailOfResponse =  knowledgeTrailRepository.findByUserResponseId(feedbackRegisterDTO.userResponseId()).get();

        return knowledgeTrailOfResponse != null && knowledgeTrailOfResponse.getRanked();

    }

}
