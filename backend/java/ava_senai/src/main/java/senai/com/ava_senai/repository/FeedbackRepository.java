package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import senai.com.ava_senai.domain.task.feedback.Feedback;

import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    @Query(" SELECT f FROM Feedback f " +
           " JOIN FETCH f.teacher t " +
           " WHERE f.userResponseId = :userResponseId ")
    Optional<Feedback> findByUserResponseId(Long userResponseId);

}
