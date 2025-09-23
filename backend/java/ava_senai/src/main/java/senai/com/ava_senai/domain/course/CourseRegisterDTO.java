package senai.com.ava_senai.domain.course;

import java.util.List;

public record CourseRegisterDTO(String name, Integer quantitySemester, List<Long> classesId) {
}
