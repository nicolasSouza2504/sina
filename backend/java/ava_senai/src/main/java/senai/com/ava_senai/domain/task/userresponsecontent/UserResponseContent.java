package senai.com.ava_senai.domain.task.userresponsecontent;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentType;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;

@Data
@Entity
@Table(name = "user_response_content")
@EqualsAndHashCode(callSuper = true, of = "id")
public class UserResponseContent extends DefaultEntity {

    @Column(nullable = false)
    private String name;

    @Column(name = "content_url")
    private String contentUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskContentType contentType;

    @ManyToOne
    @JoinColumn(name = "user_response_id", updatable = false, insertable = false)
    private UserResponse userResponse;

    @Column(name = "user_response_id", nullable = false)
    private Long userResponseId;

    @PrePersist
    public void prePersist() {

        if (userResponse != null) {
            this.userResponseId = userResponse.getId();
        }

        super.prePersist();

    }

    @PreUpdate
    public void preUpdate() {
        if (userResponse != null) {
            this.userResponseId = userResponse.getId();
        }

        super.preUpdate();
    }

}
