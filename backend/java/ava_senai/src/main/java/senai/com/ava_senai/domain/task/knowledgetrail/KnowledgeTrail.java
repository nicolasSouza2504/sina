package senai.com.ava_senai.domain.task.knowledgetrail;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.commons.lang3.BooleanUtils;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.section.Section;
import senai.com.ava_senai.domain.task.Task;

import java.util.Set;

@Data
@Entity
@Table(name = "knowledge_trail")
@EqualsAndHashCode(callSuper = true, of = "id")
public class KnowledgeTrail extends DefaultEntity {

    @Column(length = 120, nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "section_id", insertable = false, updatable = false)
    private Section section;

    @Column(name = "section_id", nullable = false)
    private Long sectionId;

    @Column(name = "ranked")
    private Boolean ranked;

    @OneToMany(mappedBy = "knowledgeTrail")
    private Set<Task> tasks;

    public KnowledgeTrail() {}

    public  KnowledgeTrail(String name, Long sectionId, Boolean ranked) {
        this.name = name;
        this.sectionId = sectionId;
        this.ranked = BooleanUtils.isTrue(ranked);
    }

}
