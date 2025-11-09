package senai.com.ava_senai.services.clazz;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.domain.course.clazz.ClassRegisterDTO;
import senai.com.ava_senai.domain.course.clazz.ClassResponseDTO;
import senai.com.ava_senai.exception.AlreadyExistsException;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.ClassRepository;
import senai.com.ava_senai.repository.CourseRepository;
import senai.com.ava_senai.repository.UserClassRepository;
import senai.com.ava_senai.repository.UserResponseRepository;
import senai.com.ava_senai.domain.course.clazz.ClassResponseSummaryDTO;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassService implements IClassService {

    private final ClassRepository classRepository;

    private final UserClassRepository userClassRepository;
    private final CourseRepository courseRepository;
    private final UserResponseRepository userResponseRepository;

    @Override
    public ClassResponseDTO createClass(ClassRegisterDTO classRegisterDTO) {

        return Optional.of(classRegisterDTO)
                .filter(turma -> !classRepository.existsByName(classRegisterDTO.name()))
                .map(registro -> {

                    validateMandatoryFields(classRegisterDTO);

                    Class clazz = buildClass(classRegisterDTO);

                    clazz = classRepository.save(clazz);

                    return new ClassResponseDTO(clazz);

                }).orElseThrow(() -> new AlreadyExistsException("Turma ja Existente"));

    }

    private Class buildClass(ClassRegisterDTO classRegisterDTO) {

        Class clazz = new Class();

        clazz.setName(classRegisterDTO.name());
        clazz.setStartDate(classRegisterDTO.startDate());
        clazz.setEndDate(classRegisterDTO.endDate());
        clazz.setImgClass(classRegisterDTO.imgClass());
        clazz.setCourseId(classRegisterDTO.courseId());
        clazz.setSemester(classRegisterDTO.semester());
        clazz.setCode(classRegisterDTO.code());

        return clazz;

    }

    @Override
    public List<ClassResponseDTO> getTurmas() {

        return Optional.of(classRepository.findAll()
                .stream()
                .map(ClassResponseDTO::new).toList())
                .filter(list -> !list.isEmpty())
                .orElseThrow(() -> new NullListException("Lista de Turmas esta Vazia!"));

    }

    @Override
    public ClassResponseDTO getTurmaById(Long turmaId) {

        return Optional.of(turmaId)
                .filter(turma -> classRepository.existsById(turmaId))
                .map(turma -> new ClassResponseDTO(classRepository.getReferenceById(turmaId)))
                .orElseThrow(() -> new NotFoundException("Turma não econtrada pelo id:" + turmaId + "!"));

    }

    @Override
    public ClassResponseSummaryDTO getTurmaSummaryById(Long turmaId) {

        return Optional.of(turmaId)
                .filter(turma -> classRepository.existsById(turmaId))
                .map(turma -> {
                    Class clazz = classRepository.getReferenceById(turmaId);
                    
                    // Busca todos os TaskUser IDs dos alunos da turma
                    List<Long> taskUserIds = clazz.getUserClasses().stream()
                            .filter(userClass -> userClass.getUser() != null && userClass.getUser().getTaskUsers() != null)
                            .flatMap(userClass -> userClass.getUser().getTaskUsers().stream())
                            .map(taskUser -> taskUser.getId())
                            .collect(Collectors.toList());
                    
                    // Busca todos os UserResponse correspondentes
                    List<UserResponse> userResponses = taskUserIds.stream()
                            .map(taskUserId -> userResponseRepository.findUserResponseByTaskUserId(taskUserId))
                            .filter(Optional::isPresent)
                            .map(Optional::get)
                            .collect(Collectors.toList());
                    
                    return new ClassResponseSummaryDTO(clazz, userResponses);
                })
                .orElseThrow(() -> new NotFoundException("Turma não econtrada pelo id:" + turmaId + "!"));

    }

    @Override
    @Transactional
    public ClassResponseDTO updateClass(ClassRegisterDTO clazzEdit, Long turmaId) {

        validateMandatoryFields(clazzEdit);

        Class clazz = classRepository.findById(turmaId)
                .orElseThrow(() -> new NotFoundException("Turma para edição não encontrada!"));

        boolean existsWithSameNome = classRepository.existsByNameLikeAndIdNot(clazzEdit.name(), turmaId);

        if (existsWithSameNome) {
            throw new AlreadyExistsException("Turma com esse Nome já existe");
        }

        clazz = updateData(clazz, clazzEdit);

        classRepository.save(clazz);

        return new ClassResponseDTO(clazz);

    }

    private Class updateData(Class clazz, ClassRegisterDTO clazzEdit) {

        clazz.setName(clazzEdit.name());
        clazz.setStartDate(clazzEdit.startDate());
        clazz.setEndDate(clazzEdit.endDate());
        clazz.setImgClass(clazzEdit.imgClass());
        clazz.setImgClass(clazzEdit.imgClass());
        clazz.setSemester(clazzEdit.semester());
        clazz.setCode(clazzEdit.code());
        clazz.setCourse(courseRepository.findById(clazzEdit.courseId()).get());

        return clazz;

    }

    @Override
    public void deleteTurma(Long turmaId) {

        classRepository.findById(turmaId)
                .ifPresentOrElse(this::delete,
                        () -> {
                            throw new NotFoundException("Turma para deletar não encontrada");
                        });

    }

    public void delete(Class clazz) {

        if (!CollectionUtils.isEmpty(clazz.getUserClasses())) {
            clazz.getUserClasses().stream().forEach(classUser -> userClassRepository.delete(classUser));
        }

        classRepository.delete(clazz);

    }

    private void validateMandatoryFields(ClassRegisterDTO classRegisterDTO) {

        Validation validation = new Validation();

        if (StringUtils.isEmpty(classRegisterDTO.name())) {
            validation.add("name", "Nome é obrigatório");
        }

        if (classRegisterDTO.courseId() == null) {
            validation.add("courseId", "Curso é obrigatório");
        } else if (!courseRepository.existsById(classRegisterDTO.courseId())) {
            validation.add("courseId", "Curso não existe");
        }

        if (classRegisterDTO.startDate() == null) {
            validation.add("startDate", "Data de início é obrigatória");
        }

        if (classRegisterDTO.endDate() == null) {
            validation.add("endDate", "Data de término é obrigatória");
        }

        if (StringUtils.isEmpty(classRegisterDTO.code())) {
            validation.add("code", "Código é obrigatório");
        }

        validation.throwIfHasErrors();

    }

}
