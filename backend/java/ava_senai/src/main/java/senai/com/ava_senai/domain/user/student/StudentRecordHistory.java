package senai.com.ava_senai.domain.user.student;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.user.User;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "student_record_history")
@NoArgsConstructor
@AllArgsConstructor
public class StudentRecordHistory extends DefaultEntity {

    @ManyToOne
    @JoinColumn(name = "record_id")
    private StudentRecord studentRecord;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "record_date")
    private Date recordDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    public StudentRecordHistory(StudentRecord studentRecord) {
        this.studentRecord = studentRecord;
        this.student = studentRecord.getStudent();
        this.teacher = studentRecord.getTeacher();
        this.recordDate = studentRecord.getRecordDate();
        this.description = studentRecord.getDescription();
    }
}
