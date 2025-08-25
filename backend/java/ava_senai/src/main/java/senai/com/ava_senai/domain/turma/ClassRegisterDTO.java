package senai.com.ava_senai.domain.turma;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ClassRegisterDTO(@NotBlank String name, LocalDate startDate, LocalDate finalDate, String imgClass) {
}

