package senai.com.ava_senai.domain.clazz;

import jakarta.persistence.*;
import lombok.*;
import senai.com.ava_senai.domain.DefaultEntity;

import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
@Table(name = "class")
public class Class extends DefaultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "final_date", nullable = false)
    private LocalDate finalDate;

    @Column(name = "img_class")
    private String imgClass;

}
