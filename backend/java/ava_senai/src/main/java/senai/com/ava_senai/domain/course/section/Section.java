package senai.com.ava_senai.domain.course.section;


import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.Course;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;

import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "section")
@EqualsAndHashCode(callSuper = true, of = "id")
public class Section extends DefaultEntity {

    @Column(length = 80, nullable = false)
    private String name;

    private Integer semester;

    @ManyToOne
    @JoinColumn(name = "course_id", insertable = false, updatable = false)
    private Course course;

    @Column(name = "course_id", nullable = false, insertable = true, updatable = true)
    private Long courseId;

    @OneToMany(mappedBy = "section")
    private Set<KnowledgeTrail> knowledgeTrails;

}
