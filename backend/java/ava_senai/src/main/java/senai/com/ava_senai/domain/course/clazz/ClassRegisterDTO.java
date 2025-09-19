package senai.com.ava_senai.domain.course.clazz;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ClassRegisterDTO(@NotBlank String name, Long courseId, LocalDate startDate, LocalDate endDate, String imgClass) {
}

