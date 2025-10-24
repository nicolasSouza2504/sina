package senai.com.ava_senai.domain.task.taskcontent;

import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.TaskContentUploadStatus;

@Data
@Entity
@Table(name = "task_contents")
public class TaskContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "content_url")
    private String contentUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskContentType contentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskContentUploadStatus status;

    @ManyToOne
    @JoinColumn(name = "task_id", updatable = false, insertable = false)
    private Task task;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @PrePersist
    @PreUpdate
    private void prePersist() {

        if (status == null) {
            status = TaskContentUploadStatus.PENDING;
        }

        if (task != null) {
            this.taskId = task.getId();
        }

    }

}
