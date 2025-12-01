package senai.com.ava_senai.domain.task.taskuser;


import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.domain.user.User;

@Data
@Entity
@Table(name = "task_user")
public class TaskUser extends DefaultEntity {

    @ManyToOne
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @OneToOne(mappedBy = "taskUser")
    private UserResponse userResponse;

}
