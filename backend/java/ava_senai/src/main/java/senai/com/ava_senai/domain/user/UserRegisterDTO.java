package senai.com.ava_senai.domain.user;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.user.role.Role;

import java.util.List;

@Data
public class UserRegisterDTO {

    private String name;
    private String email;
    private String password;
    private String cpf;
    private String nameImage;
    private Role role;
    private UserStatus status;
    private MultipartFile image;
    private Long roleId;
    private Long idInstitution;
    private List<Long> classesId;

    public UserRegisterDTO() {
    }

    public UserRegisterDTO(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.cpf = user.getCpf();
        this.nameImage = user.getNameImage();
        this.role = user.getRole();
        this.status = user.getUserStatus();
    }


    public UserRegisterDTO(String name, String email, String password, String cpf, String nameImage, Role role, MultipartFile image) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.cpf = cpf;
        this.nameImage = nameImage;
        this.role = role;
        this.status = UserStatus.ATIVO;
        this.image = image;
    }

    public UserRegisterDTO(String name, String email, String password, String cpf, String nameImage, Role role, MultipartFile image, Long idInstitution) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.cpf = cpf;
        this.nameImage = nameImage;
        this.role = role;
        this.status = UserStatus.ATIVO;
        this.image = image;
        this.idInstitution = idInstitution;
    }


}
