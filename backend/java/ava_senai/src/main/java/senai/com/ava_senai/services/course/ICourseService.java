package senai.com.ava_senai.services.course;

import senai.com.ava_senai.domain.course.CourseContentSummaryDTO;
import senai.com.ava_senai.domain.course.CourseRegisterDTO;
import senai.com.ava_senai.domain.course.CourseResponseDTO;

import java.util.List;

public interface ICourseService {

    CourseResponseDTO getCourseById(Long id);

    List<CourseResponseDTO> getAllCourses();

    CourseResponseDTO createCourse(CourseRegisterDTO courseRegisterDTO) throws Exception;

    CourseResponseDTO updateCourse(CourseRegisterDTO courseRegisterDTO, Long id);

    CourseContentSummaryDTO getCourseContentSummaryById(Long id);

    List<CourseResponseDTO> getAllCoursesByClasses(List<Long> classesIds);
}
