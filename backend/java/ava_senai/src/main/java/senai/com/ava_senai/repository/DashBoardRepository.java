package senai.com.ava_senai.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import senai.com.ava_senai.domain.dashboard.DashBoardAdmGeneralInfo;
import senai.com.ava_senai.domain.dashboard.DashBoardUserGeneralInfo;
import senai.com.ava_senai.domain.task.TaskResponseDTO;
import senai.com.ava_senai.domain.user.User;

import java.util.List;

@Repository
public interface DashBoardRepository extends JpaRepository<User, Long> {

    @Query(nativeQuery = true,
            value = " SELECT " +
                    " (SELECT COUNT(*) FROM users usr JOIN roles r ON r.id = usr.role_id WHERE usr.user_status = 0 AND r.role_name = 'STUDENT') AS totalActiveUsers, " +
                    " (SELECT COUNT(*) FROM course) AS totalCourses, " +
                    " (SELECT COUNT(*) FROM task t JOIN knowledge_trail k ON k.ranked = true AND k.id = t.knowledge_trail_id) AS totalRankedTasks, " +
                    " (SELECT COUNT(*) FROM task) AS totalTasks, " +
                    " (SELECT COUNT(*) FROM users usr JOIN roles r ON r.id = usr.role_id WHERE usr.user_status = 0 AND r.role_name = 'TEACHER') AS totalTeachers ")
    DashBoardAdmGeneralInfo getDashBoardAdmGeneralInfo();

    @Query( " SELECT t FROM Task t " +
            " JOIN t.knowledgeTrail k " +
            " JOIN k.section s " +
            " JOIN t.taskUsers tu " +
            " JOIN tu.user u " +
            " JOIN UserClass uc ON uc.userId = u.id " +
            " JOIN Class c ON c.id = uc.classId " +
            " JOIN SectionClass sc ON sc.classId = c.id AND sc.sectionId = s.id " +
            " JOIN tu.userResponse ur " +
            " WHERE tu.user.id = :userId " +
            " AND NOT EXISTS(SELECT 1 FROM Feedback f WHERE f.userResponseId = ur.id) ")
    List<TaskResponseDTO> findWaitingFeedbackTasks(Long userId);

    @Query( " SELECT t FROM Task t " +
            " JOIN t.knowledgeTrail k " +
            " JOIN k.section s " +
            " JOIN t.taskUsers tu " +
            " JOIN tu.user u " +
            " JOIN UserClass uc ON uc.userId = u.id " +
            " JOIN Class c ON c.id = uc.classId " +
            " JOIN SectionClass sc ON sc.classId = c.id AND sc.sectionId = s.id " +
            " WHERE tu.user.id = :userId " +
            " AND NOT EXISTS (SELECT 1 FROM UserResponse ur WHERE ur.taskUserId = tu.id) ")
    List<TaskResponseDTO> findPendingTasks(Long userId);

    @Query( " SELECT t FROM Task t " +
            " JOIN t.knowledgeTrail k " +
            " JOIN k.section s " +
            " JOIN t.taskUsers tu " +
            " JOIN tu.user u " +
            " JOIN UserClass uc ON uc.userId = u.id " +
            " JOIN Class c ON c.id = uc.classId " +
            " JOIN SectionClass sc ON sc.classId = c.id AND sc.sectionId = s.id " +
            " JOIN tu.userResponse ur " +
            " WHERE tu.user.id = :userId " +
            " AND EXISTS(SELECT 1 FROM Feedback f WHERE f.userResponseId = ur.id) ")
    List<TaskResponseDTO> findEvaluatedTasks(Long userId);

}
