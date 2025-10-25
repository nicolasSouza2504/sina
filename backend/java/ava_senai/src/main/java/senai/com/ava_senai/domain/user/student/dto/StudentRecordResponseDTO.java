package senai.com.ava_senai.domain.user.student.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import senai.com.ava_senai.domain.user.UserSummaryDTO;
import senai.com.ava_senai.domain.user.student.StudentRecord;

import java.util.Date;
import java.util.List;

@Data
@Getter
@Setter
public class StudentRecordResponseDTO {

    private Long recordId;

    @JsonIgnore
    private UserSummaryDTO student;

    private UserSummaryDTO teacher;

    private String description;

    private Date recordDate;

    private List<StudentRecordHistoryDTO> studentRecordHistory;

    public StudentRecordResponseDTO(StudentRecord studentRecord) {
        this.recordId = studentRecord.getId();
        this.student = new UserSummaryDTO(studentRecord.getStudent());
        this.teacher = new UserSummaryDTO(studentRecord.getTeacher());
        this.description = studentRecord.getDescription();
        this.recordDate = studentRecord.getRecordDate();
        this.studentRecordHistory = studentRecord.getHistory().stream().map(StudentRecordHistoryDTO::new).toList().reversed();
    }

}
