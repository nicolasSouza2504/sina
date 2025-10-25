package senai.com.ava_senai.domain.user.student;

import jakarta.persistence.*;
import lombok.*;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.user.User;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "student_records")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentRecord extends DefaultEntity {

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "record_date")
    private Date recordDate;

    @OneToMany
    @JoinColumn(name = "record_id")
    private List<StudentRecordHistory> history = new ArrayList<>();

    public StudentRecord(User student, User teacher, String description) {
        this.student = student;
        this.teacher = teacher;
        this.description = description;
        this.history = new ArrayList<>();
        this.recordDate = new Date();
    }
}
