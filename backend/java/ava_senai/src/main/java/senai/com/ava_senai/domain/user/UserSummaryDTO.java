package senai.com.ava_senai.domain.user;

import lombok.Data;
import senai.com.ava_senai.domain.user.role.Role;

@Data
public class UserSummaryDTO {

    private Long id;
    private String name;
    private String email;
    private String nameImage;
    private String role;

    public UserSummaryDTO(Long id, String name, String email, String nameImage, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.nameImage = nameImage;
        this.role = role.getName();
    }

    public UserSummaryDTO() {

    }

    public UserSummaryDTO(User user){
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.nameImage = user.getNameImage();
        this.role = user.getRole().getName();
    }


}
