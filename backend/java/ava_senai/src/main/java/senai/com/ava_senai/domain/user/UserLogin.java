package senai.com.ava_senai.domain.user;

import jakarta.validation.constraints.NotBlank;

public record UserLogin(@NotBlank
                        String email,
                        @NotBlank
                        String password) {
}
