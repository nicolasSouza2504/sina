package senai.com.ava_senai.domain.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import senai.com.ava_senai.domain.DefaultEntity;
import senai.com.ava_senai.domain.role.Role;

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

    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "cpf")
    private String cpf;

    @Column(name = "name_image")
    private String nameImage;

    @PrePersist
    @PreUpdate
    public void setOptions() {

        if (this.getRole() != null) {
            this.roleId = this.role.getId();
        }

    }

}
