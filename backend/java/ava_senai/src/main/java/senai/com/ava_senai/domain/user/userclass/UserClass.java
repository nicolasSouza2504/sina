package senai.com.ava_senai.domain.user.userclass;

import jakarta.persistence.*;
import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.domain.user.User;

@Entity
@Table(name = "user_class")
public class UserClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "class_id", insertable = false, updatable = false)
    private Class classEntity;

    @Column(name = "class_id", nullable = false)
    private Long classId;

    public UserClass() {}

    public UserClass(Long userId, Long classId) {
        this.userId = userId;
        this.classId = classId;
    }

}
