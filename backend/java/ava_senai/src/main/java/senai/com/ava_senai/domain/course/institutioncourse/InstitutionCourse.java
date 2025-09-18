package senai.com.ava_senai.domain.course.institutioncourse;

import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.Course;
import senai.com.ava_senai.domain.course.institution.Institution;

@Entity
@Data
@Table(name = "institution_course")
public class InstitutionCourse extends DefaultEntity {

    @ManyToOne
    @JoinColumn(name = "id_course", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "id_institution", nullable = false, updatable = false, insertable = false)
    private Institution institution;

}
