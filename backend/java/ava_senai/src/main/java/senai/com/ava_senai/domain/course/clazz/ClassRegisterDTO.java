package senai.com.ava_senai.domain.course.clazz;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.List;

public record ClassRegisterDTO(@NotBlank String name, Long courseId, LocalDate startDate, LocalDate endDate, String imgClass, String code, Integer semester, List<Long> sections) {
}
