package senai.com.ava_senai.domain.user;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.role.Role;

@Data
public class UserRegisterDTO {

    private String name;
    private String email;
    private String password;
    private String cpf;
    private String nameImage;
    private Role role;
    private MultipartFile image;
    private Long roleId;
    private Long idInstitution;

    public UserRegisterDTO() {
    }

    public UserRegisterDTO(String name, String email, String password, String cpf, String nameImage, Role role, MultipartFile image) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.cpf = cpf;
        this.nameImage = nameImage;
        this.role = role;
        this.image = image;
    }

    public UserRegisterDTO(String name, String email, String password, String cpf, String nameImage, Role role, MultipartFile image, Long idInstitution) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.cpf = cpf;
        this.nameImage = nameImage;
        this.role = role;
        this.image = image;
        this.idInstitution = idInstitution;
    }


}
