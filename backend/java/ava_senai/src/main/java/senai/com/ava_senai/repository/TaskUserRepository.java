package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import senai.com.ava_senai.domain.task.taskuser.TaskUser;

public interface TaskUserRepository extends JpaRepository<TaskUser, Long> {

    Optional<TaskUser> findByUserIdAndTaskId(Long userId, Long taskId);

    @Query(
        " SELECT DISTINCT tks FROM TaskUser tks " +
        " JOIN FETCH tks.user u " +
        " JOIN u.userClasses uc " +
        " JOIN FETCH tks.task t " +
        " JOIN FETCH t.knowledgeTrail kt " +
        " LEFT JOIN FETCH tks.userResponse urs " +
        " LEFT JOIN FETCH urs.feedback fb " +
        " WHERE uc.classId = :classId " +
        " AND kt.id = :knowledgeTrailId ")
    List<TaskUser> findTaskUsersForRanking(Long classId, Long knowledgeTrailId);
}
