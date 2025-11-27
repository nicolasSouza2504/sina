package senai.com.ava_senai.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import senai.com.ava_senai.domain.dashboard.DashBoardAdmGeneralInfo;
import senai.com.ava_senai.domain.user.User;

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

}
