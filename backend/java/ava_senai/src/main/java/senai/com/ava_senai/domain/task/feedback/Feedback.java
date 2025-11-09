package senai.com.ava_senai.domain.task.feedback;

import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.domain.user.User;

@Data
@Entity
@Table(name = "feedback")
public class Feedback extends DefaultEntity {

    @OneToOne
    @JoinColumn(name = "user_response_id", referencedColumnName = "id", insertable = false, updatable = false)
    private UserResponse userResponse;

    @Column(name = "user_response_id", nullable = false)
    private Long userResponseId;

    @ManyToOne
    @JoinColumn(name = "teacher_id", insertable = false, updatable = false)
    private User teacher;

    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;

    @Column(name = "comment", nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(name = "grade")
    private Double grade;

    @PrePersist
    public void prePersist() {
        setOptions();
        super.prePersist();
    }

    @PreUpdate
    public void preUpdate() {
        setOptions();
        super.preUpdate();
    }

    private void setOptions() {

        if (userResponse != null) {
            this.userResponseId = userResponse.getId();
        }
        if (teacher != null) {
            this.teacherId = teacher.getId();
        }

    }

}
