package senai.com.ava_senai.domain.task.userresponse;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.task.feedback.Feedback;
import senai.com.ava_senai.domain.task.taskuser.TaskUser;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContent;

import java.util.Set;

@Data
@Entity
@Table(name = "user_response")
@EqualsAndHashCode(callSuper = true, of = "id")
public class UserResponse extends DefaultEntity {

    @Column(columnDefinition = "TEXT")
    private String comment;

    @OneToMany(mappedBy = "userResponse")
    private Set<UserResponseContent> userResponseContents;

    @ManyToOne
    @JoinColumn(name = "task_user_id", insertable = false, updatable = false)
    private TaskUser taskUser;

    @Column(name = "task_user_id", nullable = false)
    private Long taskUserId;

    @OneToOne(mappedBy = "userResponse")
    private Feedback feedback;

    public UserResponse() {
    }

    public UserResponse(Long taskUserId, String comment) {
        this.taskUserId = taskUserId;
        this.comment = comment;
    }

    @PrePersist
    public void prePersist() {
        if (this.taskUser != null) {
            this.taskUserId = this.taskUser.getId();
        }
        super.prePersist();

    }

    @PreUpdate
    public void preUpdate() {
        if (this.taskUser != null) {
            this.taskUserId = this.taskUser.getId();
        }
        super.preUpdate();
    }

}
