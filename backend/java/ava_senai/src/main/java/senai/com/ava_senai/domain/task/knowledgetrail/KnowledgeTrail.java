package senai.com.ava_senai.domain.task.knowledgetrail;

import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.section.Section;
import senai.com.ava_senai.domain.task.Task;

import java.util.List;

@Data
@Entity
@Table(name = "knowledge_trail")
public class KnowledgeTrail extends DefaultEntity {

    @Column(length = 120, nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "section_id", insertable = false, updatable = false)
    private Section section;

    @Column(name = "section_id", nullable = false)
    private Long sectionId;

    @OneToMany(mappedBy = "knowledgeTrail")
    private List<Task> tasks;

    public KnowledgeTrail() {}

    public  KnowledgeTrail(String name, Long sectionId) {
        this.name = name;
        this.sectionId = sectionId;
    }

}
