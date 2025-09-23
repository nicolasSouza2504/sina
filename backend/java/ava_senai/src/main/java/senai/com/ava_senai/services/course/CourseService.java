package senai.com.ava_senai.services.course;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.course.Course;
import senai.com.ava_senai.domain.course.CourseRegisterDTO;
import senai.com.ava_senai.domain.course.CourseResponseDTO;
import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.repository.ClassRepository;
import senai.com.ava_senai.repository.CourseRepository;

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

    // todo backend - cadastro de session cadsatro de knowledge trail

    @Transactional
    public void updateClasses(Course courseDb, CourseRegisterDTO courseRegisterDTO) {

        if (courseRegisterDTO.classesId() != null && !courseRegisterDTO.classesId().isEmpty()) {

            courseDb.getClasses().forEach(clazz -> {

                clazz.setCourseId(null);
                classRepository.save(clazz);

            });

            courseRegisterDTO.classesId().forEach(classID -> {
                updateClass(classID, courseDb);
            });

        }

    }

    public void updateClass(Long classID, Course course) {

        Class clazz = classRepository.findById(classID).orElseThrow(() -> new NotFoundException("Turma não encontrada pelo id:" + classID + "!"));

        if (clazz.getCourseId() != null) {
            throw new RuntimeException("Turma " + clazz.getName() + " ja está em um curso!");
        } else {
            clazz.setCourseId(course.getId());
            classRepository.save(clazz);
        }

    }

    private Course buildCourse(CourseRegisterDTO courseRegisterDTO) {

        Course course = new Course();

        course.setName(courseRegisterDTO.name());
        course.setQuantitySemester(courseRegisterDTO.quantitySemester());

        return course;

    }

    private void validateMandatoryFields(CourseRegisterDTO courseRegisterDTO) {

    }

    @Override
    public CourseResponseDTO updateCourse(CourseRegisterDTO courseRegisterDTO, Long id) throws Exception {

        validateMandatoryFields(courseRegisterDTO);

        return Optional.ofNullable(courseRepository.findById(id))
                .get()
                .map((courseDB) -> {

                    validateMandatoryFields(courseRegisterDTO);

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
