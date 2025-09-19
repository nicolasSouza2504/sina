package senai.com.ava_senai.domain.task.knowledgetrail;

import jakarta.persistence.*;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.section.Section;
import senai.com.ava_senai.domain.task.Task;

import java.util.List;

@Entity
@Table(name = "knowledge_trail")
public class KnowledgeTrail extends DefaultEntity {

    @Column(length = 120, nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Section section;

    @OneToMany(mappedBy = "knowledgeTrail")
    private List<Task> tasks;

}
