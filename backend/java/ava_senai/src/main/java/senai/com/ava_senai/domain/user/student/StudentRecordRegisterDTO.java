package senai.com.ava_senai.domain.user.student;

import lombok.Data;

@Data
public class StudentRecordRegisterDTO {

    private Long studentId;

    private Long teacherId;

    private String description;

}
