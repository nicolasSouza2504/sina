package senai.com.ava_senai.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import senai.com.ava_senai.handler.requesthandler.security.user.AuthyUserDetails;

import java.util.Date;

@Data
@MappedSuperclass
public class DefaultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "id_institution", nullable = false, updatable = false)
    private Long idInstitution;

    @PrePersist
    public void prePersist() {
        if (this.idInstitution == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                Object principal = auth.getPrincipal();
                if (principal instanceof AuthyUserDetails user) {
                    this.idInstitution = user.getIdInstitution();
                }
            }

        }
        this.createdAt = new Date();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = new Date();
    }

}
