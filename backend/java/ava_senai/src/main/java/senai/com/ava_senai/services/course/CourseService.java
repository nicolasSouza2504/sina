package senai.com.ava_senai.services.course;

import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.course.Course;
import senai.com.ava_senai.domain.course.CourseContentSummaryDTO;
import senai.com.ava_senai.domain.course.CourseRegisterDTO;
import senai.com.ava_senai.domain.course.CourseResponseDTO;
import senai.com.ava_senai.domain.course.section.Section;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.CourseRepository;
import senai.com.ava_senai.repository.SectionRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService implements ICourseService {

    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;

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

                    List<Section> sectionsDefault = saveDefaultSections(course);

                    return new CourseResponseDTO(course, sectionsDefault);

                })
                .orElseThrow(() -> new Exception("Oops! Course already exists!"));

    }

    @Transactional
    public List<Section> saveDefaultSections(Course course) {

        List<Section> defaultSections = new ArrayList<>();

        for (Integer i = 1; i <= course.getQuantitySemester(); i++) {

            Section section = new Section();

            section.setSemester(i);
            section.setCourseId(course.getId());
            section.setName(i + "º Semestre");

            defaultSections.add(sectionRepository.save(section));

        }

        return defaultSections;

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
        } else if (courseRegisterDTO.name().length() > 80) {
            validation.add("Name", "Nome deve ter no máximo 80 caracteres");
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

                    return new CourseResponseDTO(courseDB);

                })
                .orElseThrow(() -> new NotFoundException("Curso não existe!"));

    }

    @Override
    public CourseContentSummaryDTO getCourseContentSummaryById(Long id) {

        Course course = courseRepository.findCourseWithContentById(id)
                .orElseThrow(() -> new NotFoundException("Curso não encontrado!"));

        return new CourseContentSummaryDTO(course);

    }

    @Override
    public List<CourseResponseDTO> getAllCoursesByClasses(List<Long> classesIds) {

        if (classesIds.isEmpty()) {
            throw new NullListException("Lista de classes está vazia");
        }

        List<CourseResponseDTO> courseList = courseRepository.findAllByClassesIds(classesIds);

        if (courseList.isEmpty()) {
            throw new NullListException("Lista de cursos Vazia");
        }

        return courseList;

    }


    private Course updateData(Course courseDB, CourseRegisterDTO courseRegisterDTO) {

        courseDB.setName(courseRegisterDTO.name());
        courseDB.setQuantitySemester(courseRegisterDTO.quantitySemester());

        return courseDB;

    }

}
