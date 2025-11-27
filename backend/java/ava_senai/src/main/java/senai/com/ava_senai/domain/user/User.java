package senai.com.ava_senai.domain.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.course.institution.Institution;
import senai.com.ava_senai.domain.task.taskuser.TaskUser;
import senai.com.ava_senai.domain.user.address.Address;
import senai.com.ava_senai.domain.user.role.Role;
import senai.com.ava_senai.domain.user.userclass.UserClass;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User extends DefaultEntity {

    @Column(name = "name")
    private String name;

    @Email
    private String email;

    @Column(name = "password")
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id", updatable = false, insertable = false, foreignKey = @ForeignKey(name = "fk_user_role"))
    private Role role;

    @Column(name = "user_status")
    private UserStatus userStatus;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToMany(mappedBy = "user")
    private List<UserClass> userClasses;

    @OneToMany(mappedBy = "user")
    private List<TaskUser> taskUsers;

    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "cpf")
    private String cpf;

    @Column(name = "name_image")
    private String nameImage;

    @ManyToOne
    @JoinColumn(name = "id_institution", referencedColumnName = "id",updatable = false, insertable = false, foreignKey = @ForeignKey(name = "fk_user_institution") )
    private Institution institution;

    @PrePersist
    @PreUpdate
    public void setOptions() {

        if (this.getRole() != null) {
            this.roleId = this.role.getId();
        }

    }

}
