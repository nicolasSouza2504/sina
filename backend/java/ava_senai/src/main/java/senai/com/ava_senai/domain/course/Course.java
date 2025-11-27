package senai.com.ava_senai.domain.course;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.domain.course.section.Section;

import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "course")
@EqualsAndHashCode(callSuper = true, of = "id")
public class Course extends DefaultEntity {

    @Column(name = "quantity_semester")
    private Integer quantitySemester;

    @Column(length = 80, nullable = false)
    private String name;

    @OneToMany(mappedBy = "course")
    private Set<Section> sections;

    @OneToMany(mappedBy = "course")
    private List<Class> classes;

}
