package senai.com.ava_senai.domain.user.student;

import jakarta.persistence.*;
import lombok.*;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.user.User;

@Entity
@Getter
@Setter
@Table(name = "student_records")
@NoArgsConstructor
@AllArgsConstructor
public class StudentRecord extends DefaultEntity {

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @Column(columnDefinition = "TEXT")
    private String description;

}
