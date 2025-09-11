package senai.com.ava_senai.domain.clazz;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ClassRegisterDTO(@NotBlank String name, LocalDate startDate, LocalDate finalDate, String imgClass) {
}

