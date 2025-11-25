package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.domain.task.rankedtask.RankedTask;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;

import java.util.List;
import java.util.Set;

public interface TaskRepository extends JpaRepository<Task, Long> {

    static final String SUBQUERY_QUANTITY_SUBMISSIONS = " (SELECT COUNT(*) FROM task_user tu " +
            " JOIN user_response ur ON ur.task_user_id = tu.id" +
            " WHERE tu.task_id = t.id)";

    static final String SUBQUERY_LAST_SUBMISSION = "(SELECT MAX(ur.created_at) FROM task_user tu " +
            " JOIN user_response ur ON ur.task_user_id = tu.id " +
            " WHERE tu.task_id = t.id) ";

    @Query(nativeQuery = true,
           value =
           " SELECT t.name AS name, " +
                   " t.id AS id, " +
                   " t.description AS description, " +
                   " t.created_at AS startDate, " +
                     SUBQUERY_QUANTITY_SUBMISSIONS + " AS quantitySubmissions, " +
                     SUBQUERY_LAST_SUBMISSION + " AS lastSubmission, " +
                   " kt.id AS idKnowledgeTrail, " +
                   " kt.name AS nameKnowledgeTrail " +
           " FROM task t " +
           " JOIN knowledge_trail kt ON kt.id = t.knowledge_trail_id " +
           " JOIN section s ON s.id = kt.section_id " +
           " JOIN course co ON co.id = s.course_id " +
           " JOIN class cls on cls.course_id = co.id " +
           " WHERE cls.id = :classId " +
           " AND kt.ranked = true ")
    List<RankedTask> findRankedTasksByClassId(Long classId);
}
