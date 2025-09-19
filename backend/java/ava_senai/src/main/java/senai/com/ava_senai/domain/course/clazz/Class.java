package senai.com.ava_senai.domain.course.clazz;

import jakarta.persistence.*;
import lombok.*;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.Course;
import senai.com.ava_senai.domain.user.userclass.UserClass;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@Table(name = "class")
public class Class extends DefaultEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(length = 100, unique = true)
    private String code;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "img_class")
    private String imgClass;

    private Integer semester;

    @ManyToOne
    @JoinColumn(name = "course_id", updatable = false, insertable = false)
    private Course course;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @OneToMany(mappedBy = "classEntity")
    private List<UserClass> userClasses;


}
