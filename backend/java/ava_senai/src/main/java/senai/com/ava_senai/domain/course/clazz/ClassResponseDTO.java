package senai.com.ava_senai.domain.course.clazz;

import java.time.LocalDate;

public record ClassResponseDTO(Long Id, String nome, LocalDate startDate, LocalDate finalDate, String imgClass, Integer semester, String code) {
    public ClassResponseDTO(Class clazz) {
        this(clazz.getId(), clazz.getName(), clazz.getStartDate(), clazz.getEndDate(), clazz.getImgClass(), clazz.getSemester(), clazz.getCode());
    }
}
