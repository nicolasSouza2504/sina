package senai.com.ava_senai.domain.task.taskcontenttype;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;

@Data
@Entity
@Table(name = "task_content_type")
public class TaskContentType extends DefaultEntity {

    @Column(nullable = false, length = 50)
    private String name; // PDF, Video etc.

}
