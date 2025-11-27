package senai.com.ava_senai.domain.course.clazz.sectionclass;

import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.domain.course.section.Section;

@Data
@Entity
@Table(name = "section_class")
public class SectionClass extends DefaultEntity {

    @ManyToOne
    @JoinColumn(name = "section_id", insertable = false, updatable = false)
    private Section section;

    @Column(name = "section_id", nullable = false)
    private Long sectionId;

    @ManyToOne
    @JoinColumn(name = "class_id", insertable = false, updatable = false)
    private Class classEntity;

    @Column(name = "class_id", nullable = false)
    private Long classId;

    public SectionClass() {}

    public SectionClass(Long sectionId, Long classId) {
        this.sectionId = sectionId;
        this.classId = classId;
    }

    @PrePersist
    public void prePersist() {
        if (this.section != null) {
            this.sectionId = this.section.getId();
        }
        if (this.classEntity != null) {
            this.classId = this.classEntity.getId();
        }
        super.prePersist();

    }

    @PreUpdate
    public void preUpdate() {
        if (this.section != null) {
            this.sectionId = this.section.getId();
        }
        if (this.classEntity != null) {
            this.classId = this.classEntity.getId();
        }
        super.preUpdate();
    }


}
