package senai.com.ava_senai.domain.user;


import jakarta.annotation.Nullable;

public record UserFinderDTO(@Nullable Long role, @Nullable String name, @Nullable Long idClass, @Nullable Long idCourse) {
}
