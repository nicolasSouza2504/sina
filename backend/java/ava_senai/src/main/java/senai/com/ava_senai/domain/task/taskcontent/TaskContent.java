package senai.com.ava_senai.domain.task.taskcontent;


import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.taskcontenttype.TaskContentType;

@Data
@Entity
@Table(name = "task_content")
public class TaskContent extends DefaultEntity {

    @Column(length = 120, nullable = false)
    private String name;

    private Integer order;

    @Column(length = 1000)
    private String contentUrl;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "task_content_type_id", nullable = false)
    private TaskContentType contentType;

}
