package senai.com.ava_senai.domain.user.student;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import senai.com.ava_senai.domain.user.UserSummaryDTO;

import java.util.Date;

@Data
@Getter
@Setter
public class StudentRecordResponseDTO {

    @JsonIgnore
    private UserSummaryDTO student;

    private UserSummaryDTO teacher;

    private String description;

    private Date recordDate;

    public StudentRecordResponseDTO(StudentRecord studentRecord) {
        this.student = new UserSummaryDTO(studentRecord.getStudent());
        this.teacher = new UserSummaryDTO(studentRecord.getTeacher());
        this.description = studentRecord.getDescription();
        this.recordDate = studentRecord.getCreatedAt();
    }

}
