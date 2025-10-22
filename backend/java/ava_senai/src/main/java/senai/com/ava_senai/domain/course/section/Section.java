package senai.com.ava_senai.domain.course.section;


import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.Course;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;

import java.util.List;

@Data
@Entity
@Table(name = "section")
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
    private List<KnowledgeTrail> knowledgeTrails;

}
