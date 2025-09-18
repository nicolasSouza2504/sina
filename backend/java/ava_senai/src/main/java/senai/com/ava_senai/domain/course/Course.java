package senai.com.ava_senai.domain.course;


import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.section.Section;

import java.util.List;

@Data
@Entity
@Table(name = "course")
public class Course extends DefaultEntity {

    @Column(name = "quantity_semester")
    private Integer quantitySemester;

    @Column(length = 80, nullable = false)
    private String name;

    @OneToMany(mappedBy = "course")
    private List<Section> sections;

}
