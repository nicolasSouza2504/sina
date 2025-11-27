package senai.com.ava_senai.services.user.student;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.domain.user.role.Roles;
import senai.com.ava_senai.domain.user.student.StudentRecord;
import senai.com.ava_senai.domain.user.student.StudentRecordHistory;
import senai.com.ava_senai.domain.user.student.dto.StudentRecordEditDTO;
import senai.com.ava_senai.domain.user.student.dto.StudentRecordRegisterDTO;
import senai.com.ava_senai.domain.user.student.dto.StudentRecordResponseDTO;
import senai.com.ava_senai.exception.IncorrectRoleException;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.UserNotFoundException;
import senai.com.ava_senai.repository.StudentRecordHistoryRepository;
import senai.com.ava_senai.repository.StudentRecordRepository;
import senai.com.ava_senai.repository.UserRepository;
import senai.com.ava_senai.services.user.UserService;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentRecordService implements IStudentRecordService {

    private final StudentRecordRepository studentRecordRepository;
    private final StudentRecordHistoryRepository studentRecordHistoryRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    public List<StudentRecordResponseDTO> getStudentRecords(Long studentId) {
        User student = userRepository.findById(studentId).orElseThrow(() -> new UserNotFoundException("Aluno não encontrado"));

        List<StudentRecord> studentRecordDTOList = studentRecordRepository.findAllByStudent(student);
        
        return studentRecordDTOList.stream().map(StudentRecordResponseDTO::new).toList();
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public StudentRecordResponseDTO createStudentRecord(StudentRecordRegisterDTO request) {
        User student = userRepository.findById(request.getStudentId()).orElseThrow(() -> new UserNotFoundException("Aluno não encontrado"));
        if (!(student.getRole().getId() == Roles.STUDENT.getValue())) {
            throw new IncorrectRoleException("Usuário informado para o campo aluno não possui o perfil correto");
        }

        User teacher = userRepository.findById(request.getTeacherId()).orElseThrow(() -> new UserNotFoundException("Professor não encontrado"));
        if (!(teacher.getRole().getId() == Roles.TEACHER.getValue())) {
            throw new IncorrectRoleException("Usuário informado para o campo professor não possui o perfil correto");
        }

        StudentRecord studentRecord = new StudentRecord(student, teacher, request.getDescription());
        studentRecord = studentRecordRepository.save(studentRecord);

        return new StudentRecordResponseDTO(studentRecord);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public StudentRecordResponseDTO editStudentRecord(Long recordId, StudentRecordEditDTO newStudentRecord) {
        StudentRecord studentRecord = studentRecordRepository
                                    .findById(recordId)
                                    .orElseThrow(() -> new NotFoundException("Registro de observação de aluno não encontrado"));

        User teacher = userRepository.findById(newStudentRecord.getTeacherId()).orElseThrow(() -> new UserNotFoundException("Professor não encontrado"));
        if (!(teacher.getRole().getId() == Roles.TEACHER.getValue())) {
            throw new IncorrectRoleException("Usuário informado para o campo professor não possui o perfil correto");
        }

        studentRecordHistoryRepository.save(new StudentRecordHistory(studentRecord));

        studentRecord.setTeacher(teacher);
        studentRecord.setDescription(newStudentRecord.getDescription());
        studentRecord.setRecordDate(new Date());

        studentRecord = studentRecordRepository.save(studentRecord);

        return new StudentRecordResponseDTO(studentRecord);
    }

    @Override
    public void deleteStudentRecord(Long recordId) {
        StudentRecord studentRecord = studentRecordRepository
                .findById(recordId)
                .orElseThrow(() -> new NotFoundException("Registro de observação de aluno não encontrado"));

        studentRecord.setIsVisible(false);
        studentRecordRepository.save(studentRecord);
    }
}
