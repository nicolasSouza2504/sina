package senai.com.ava_senai.domain.course;

public record CourseResponseDTO(String name, Integer quantitySemester) {

    public CourseResponseDTO(Course course) {
        this(course.getName(), course.getQuantitySemester());
    }

}
