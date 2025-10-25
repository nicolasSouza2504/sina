package senai.com.ava_senai.services.user.student;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.domain.user.role.Roles;
import senai.com.ava_senai.domain.user.student.StudentRecord;
import senai.com.ava_senai.domain.user.student.StudentRecordRegisterDTO;
import senai.com.ava_senai.domain.user.student.StudentRecordResponseDTO;
import senai.com.ava_senai.exception.IncorrectRoleException;
import senai.com.ava_senai.exception.UserNotFoundException;
import senai.com.ava_senai.repository.StudentRecordRepository;
import senai.com.ava_senai.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentRecordService implements IStudentRecordService {

    private final StudentRecordRepository studentRecordRepository;
    private final UserRepository userRepository;

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
}
