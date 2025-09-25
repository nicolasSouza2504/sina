package senai.com.ava_senai.services.clazz;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.domain.course.clazz.ClassRegisterDTO;
import senai.com.ava_senai.domain.course.clazz.ClassResponseDTO;
import senai.com.ava_senai.exception.AlreadyExistsException;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.repository.ClassRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClassService implements IClassService {

    private final ClassRepository classRepository;

    @Override
    public ClassResponseDTO createClass(ClassRegisterDTO classRegisterDTO) {

        return Optional.of(classRegisterDTO)
                .filter(turma -> !classRepository.existsByName(classRegisterDTO.name()))
                .map(registro -> {

                    Class clazz = new Class();

                    clazz.setName(classRegisterDTO.name());
                    clazz.setStartDate(classRegisterDTO.startDate());
                    clazz.setEndDate(classRegisterDTO.endDate());
                    clazz.setImgClass(classRegisterDTO.imgClass());
                    clazz.setCourseId(classRegisterDTO.courseId());
                    clazz.setSemester(classRegisterDTO.semester());
                    clazz.setCode(classRegisterDTO.code());

                    clazz = classRepository.save(clazz);

                    return new ClassResponseDTO(clazz);

                }).orElseThrow(() -> new AlreadyExistsException("Turma ja Existente"));

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
    @Transactional
    public ClassResponseDTO updateClass(ClassRegisterDTO clazzEdit, Long turmaId) {

        Class clazz = classRepository.findById(turmaId)
                .orElseThrow(() -> new NotFoundException("Turma para edição não encontrada!"));

        boolean existsWithSameNome = classRepository.existsByNameLikeAndIdNot(clazzEdit.name(), turmaId);

        if (existsWithSameNome) {
            throw new AlreadyExistsException("Turma com esse Nome já existe");
        }

        clazz.setName(clazzEdit.name());
        clazz.setStartDate(clazzEdit.startDate());
        clazz.setEndDate(clazzEdit.endDate());
        clazz.setImgClass(clazzEdit.imgClass());
        clazz.setSemester(clazzEdit.semester());
        clazz.setCode(clazzEdit.code());

        classRepository.save(clazz);

        return new ClassResponseDTO(clazz);

    }

    @Override
    public void deleteTurma(Long turmaId) {

        classRepository.findById(turmaId)
                .ifPresentOrElse(classRepository::delete,
                        () -> {
                            throw new NotFoundException("Turma para deletar não encontrada");
                        });

    }

}
