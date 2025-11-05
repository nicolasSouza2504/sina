package senai.com.ava_senai.services.user.student;

import jakarta.validation.Valid;
import senai.com.ava_senai.domain.user.student.dto.StudentRecordEditDTO;
import senai.com.ava_senai.domain.user.student.dto.StudentRecordRegisterDTO;
import senai.com.ava_senai.domain.user.student.dto.StudentRecordResponseDTO;

import java.util.List;

public interface IStudentRecordService {

    List<StudentRecordResponseDTO> getStudentRecords(Long studentId);

    StudentRecordResponseDTO createStudentRecord(StudentRecordRegisterDTO studentRecordDTO);

    StudentRecordResponseDTO editStudentRecord(Long studentId, StudentRecordEditDTO studentRecordDTO);

    void deleteStudentRecord(@Valid Long recordId);
}
