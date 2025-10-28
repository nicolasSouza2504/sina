package senai.com.ava_senai.domain.task;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.taskuser.TaskUser;

import java.util.Date;
import java.util.Set;

@Data
@Entity
@Table(name = "task")
@EqualsAndHashCode(callSuper = true, of = "id")
public class Task extends DefaultEntity {

    @Column(length = 200, nullable = false)
    private String name;

    private Integer taskOrder;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "difficulty_level", nullable = false)
    @Enumerated(EnumType.STRING)
    private Dificuldade difficultyLevel;

    @Column(name = "due_date", nullable = false)
    private Date dueDate;

    @ManyToOne
    @JoinColumn(name = "knowledge_trail_id", nullable = false, updatable = false, insertable = false)
    private KnowledgeTrail knowledgeTrail;

    @Column(name = "knowledge_trail_id", nullable = false)
    private Long knowledgeTrailId;

    @OneToMany(mappedBy = "task")
    private Set<TaskContent> contents;

    @OneToMany(mappedBy = "task")
    private Set<TaskUser> taskUsers;

}
