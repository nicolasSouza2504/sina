package senai.com.ava_senai.domain.course.institution;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import senai.com.ava_senai.domain.course.institutioncourse.InstitutionCourse;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@Table(name = "institution")
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "institution_name")
    private String institutionName;


    @OneToMany(mappedBy = "institution", cascade = CascadeType.ALL)
    private List<InstitutionCourse> courses;

}
