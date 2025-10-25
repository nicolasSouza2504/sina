package senai.com.ava_senai.domain.user.student.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import senai.com.ava_senai.domain.user.UserSummaryDTO;
import senai.com.ava_senai.domain.user.student.StudentRecordHistory;

import java.util.Date;

@Data
@Getter
@Setter
public class StudentRecordHistoryDTO {

    private Long recordId;

    @JsonIgnore
    private UserSummaryDTO student;

    private UserSummaryDTO teacher;

    private String description;

    private Date recordDate;


    public StudentRecordHistoryDTO(StudentRecordHistory studentRecordHistory) {
        this.recordId = studentRecordHistory.getId();
        this.student = new UserSummaryDTO(studentRecordHistory.getStudent());
        this.teacher = new UserSummaryDTO(studentRecordHistory.getTeacher());
        this.description = studentRecordHistory.getDescription();
        this.recordDate = studentRecordHistory.getRecordDate();
    }

}
