package senai.com.ava_senai.services.course;

import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import senai.com.ava_senai.domain.course.Course;
import senai.com.ava_senai.domain.course.CourseRegisterDTO;
import senai.com.ava_senai.domain.course.CourseResponseDTO;
import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.ClassRepository;
import senai.com.ava_senai.repository.CourseRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService implements ICourseService {

    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;

    @Override
    public CourseResponseDTO getCourseById(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Curso não encontrado!"));

        return new CourseResponseDTO(course);

    }

    @Override
    public List<CourseResponseDTO> getAllCourses() {

        List<CourseResponseDTO> courseList = courseRepository.findAll().stream().map(CourseResponseDTO::new).toList();

        if (courseList.isEmpty()) {
            throw new NullListException("Lista de cursos Vazia");
        }

        return courseList;

    }

    @Override
    public CourseResponseDTO createCourse(CourseRegisterDTO courseRegisterDTO) throws Exception {

        return Optional.of(courseRegisterDTO)
                .filter(course -> !courseRepository.existsByName(courseRegisterDTO.name()))
                .map(req -> {

                    validateMandatoryFields(courseRegisterDTO);

                    Course course = buildCourse(courseRegisterDTO);

                    course = courseRepository.save(course);

                    updateClasses(course, courseRegisterDTO);

                    return new CourseResponseDTO(course);

                })
                .orElseThrow(() -> new Exception("Oops! Course already exists!"));

    }

    // todo backend - cadastro de session e cadastro de knowledge trail
    @Transactional
    public void updateClasses(Course courseDb, CourseRegisterDTO courseRegisterDTO) {

        removeOldClassesRelatedData(courseDb);
        insertNewClassesRelationship(courseDb, courseRegisterDTO);

    }

    @Transactional
    public void insertNewClassesRelationship(Course courseDb, CourseRegisterDTO courseRegisterDTO) {

        if (!CollectionUtils.isEmpty(courseRegisterDTO.classesId())) {

            final List<Class> newClasses = new ArrayList<>();

            courseRegisterDTO.classesId().forEach(classID -> {
                newClasses.add(insertNewClassRelationship(classID, courseDb));
            });

            courseDb.setClasses(newClasses);

        }

    }

    @Transactional
    public void removeOldClassesRelatedData(Course courseDb) {

        if (!CollectionUtils.isEmpty(courseDb.getClasses())) {

            courseDb.getClasses().forEach(clazz -> {

                clazz.setCourseId(null);
                clazz.setCourse(null);

                classRepository.save(clazz);

            });

        }

    }

    public Class insertNewClassRelationship(Long classID, Course courseDb) {

        Class clazz = classRepository.findById(classID).orElseThrow(() -> new NotFoundException("Turma não encontrada pelo id:" + classID + "!"));

        if (clazz.getCourseId() != null) {

            if (!clazz.getCourseId().equals(courseDb.getId())) {
                throw new RuntimeException("Turma " + clazz.getName() + " ja está em um curso!");
            }

        } else {

            clazz.setCourseId(courseDb.getId());
            clazz.setCourse(courseDb);

            clazz = classRepository.save(clazz);

        }

        return clazz;

    }

    private Course buildCourse(CourseRegisterDTO courseRegisterDTO) {

        Course course = new Course();

        course.setName(courseRegisterDTO.name());
        course.setQuantitySemester(courseRegisterDTO.quantitySemester());

        return course;

    }

    private void validateMandatoryFields(CourseRegisterDTO courseRegisterDTO) {

        Validation validation = new Validation();

        if (StringUtils.isEmpty(courseRegisterDTO.name())) {
            validation.add("Name", "Nome é obrigatório");
        }

        if (courseRegisterDTO.quantitySemester() != null && courseRegisterDTO.quantitySemester() <= 0) {
            validation.add("Quantidade Semestre", "O curso deve ter no mínimo 1 semestre");
        }

        validation.throwIfHasErrors();

    }

    @Override
    public CourseResponseDTO updateCourse(CourseRegisterDTO courseRegisterDTO, Long id) {

        validateMandatoryFields(courseRegisterDTO);

        return Optional.ofNullable(courseRepository.findById(id))
                .get()
                .map((courseDB) -> {

                    courseRepository.save(updateData(courseDB, courseRegisterDTO));

                    updateClasses(courseDB, courseRegisterDTO);

                    return new CourseResponseDTO(courseDB);

                })
                .orElseThrow(() -> new NotFoundException("Curso não existe!"));

    }


    private Course updateData(Course courseDB, CourseRegisterDTO courseRegisterDTO) {

        courseDB.setName(courseRegisterDTO.name());
        courseDB.setQuantitySemester(courseRegisterDTO.quantitySemester());

        return courseDB;

    }

}
