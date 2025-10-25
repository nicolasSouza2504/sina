package senai.com.ava_senai.services.user.student;

import senai.com.ava_senai.domain.user.student.StudentRecordRegisterDTO;
import senai.com.ava_senai.domain.user.student.StudentRecordResponseDTO;

import java.util.List;

public interface IStudentRecordService {

    List<StudentRecordResponseDTO> getStudentRecords(Long  studentId);

    StudentRecordResponseDTO createStudentRecord(StudentRecordRegisterDTO studentRecordDTO);

}
