package senai.com.ava_senai.taskuser;


import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.user.User;

@Data
@Entity
@Table(name = "task_user")
public class TaskUser extends DefaultEntity {

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
