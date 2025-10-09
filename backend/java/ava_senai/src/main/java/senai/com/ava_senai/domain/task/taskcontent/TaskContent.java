package senai.com.ava_senai.domain.task.taskcontent;


import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.TaskContentUploadStatus;

@Data
@Entity
@Table(name = "task_content")
public class TaskContent extends DefaultEntity {

    @Column(name = "identifier", length = 36, nullable = false, unique = true)
    String identifier;

    @Column(length = 120, nullable = false)
    private String name;

    @Column(length = 1000)
    private String contentUrl;

    @ManyToOne
    @JoinColumn(name = "task_id", updatable = false, insertable = false)
    private Task task;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false)
    private TaskContentType contentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskContentUploadStatus status;

    @PreUpdate
    @PrePersist
    public void setOptions() {
        if (this.task != null) {
            this.taskId = this.task.getId();
        }
    }
}
