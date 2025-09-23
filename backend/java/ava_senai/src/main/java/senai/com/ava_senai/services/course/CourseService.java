package senai.com.ava_senai.services.course;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.course.Course;
import senai.com.ava_senai.domain.course.CourseRegisterDTO;
import senai.com.ava_senai.domain.course.CourseResponseDTO;
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

    public void updateClasses(Course course, CourseRegisterDTO courseRegisterDTO) {

        if (courseRegisterDTO.classesId() != null && !courseRegisterDTO.classesId().isEmpty()) {

            courseRegisterDTO.classesId().forEach(classID -> {

                classRepository.findById(classID).ifPresent(clazz -> {

                    clazz.setCourse(course);

                    classRepository.save(clazz);

                });

            });

        }

    }

    private Course buildCourse(CourseRegisterDTO courseRegisterDTO) {
        return null;
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
