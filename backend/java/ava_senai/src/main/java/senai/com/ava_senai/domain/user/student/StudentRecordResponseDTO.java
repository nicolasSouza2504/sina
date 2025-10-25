package senai.com.ava_senai.domain.user.student;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import senai.com.ava_senai.domain.user.User;

import java.util.Date;

@Data
@Getter
@Setter
public class StudentRecordResponseDTO {

    private User student;

    private User teacher;

    private String description;

    private Date recordDate;

    public StudentRecordResponseDTO(StudentRecord studentRecord) {
        this.student = studentRecord.getStudent();
        this.teacher = studentRecord.getTeacher();
        this.description = studentRecord.getDescription();
        this.recordDate = studentRecord.getCreatedAt();
    }

}
