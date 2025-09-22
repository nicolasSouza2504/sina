package senai.com.ava_senai.domain.task;

import jakarta.persistence.*;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;
import senai.com.ava_senai.taskuser.TaskUser;

import java.util.List;

@Entity
@Table(name = "task")
public class Task extends DefaultEntity {

    @Column(length = 200, nullable = false)
    private String name;

    private Integer taskOrder;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "knowledge_trail_id", nullable = false)
    private KnowledgeTrail knowledgeTrail;

    @OneToMany(mappedBy = "task")
    private List<TaskContent> contents;

    @OneToMany(mappedBy = "task")
    private List<TaskUser> taskUsers;

}
