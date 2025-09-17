package senai.com.ava_senai.domain.course.section;


import jakarta.persistence.*;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.Course;

@Entity
@Table(name = "section")
public class Section extends DefaultEntity {

    private Integer semester;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToMany(mappedBy = "section")
    private List<KnowledgeTrail> knowledgeTrails;

}
