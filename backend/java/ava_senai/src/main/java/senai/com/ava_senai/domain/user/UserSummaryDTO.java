package senai.com.ava_senai.domain.user;

import lombok.Data;

@Data
public class UserSummaryDTO {

    private Long id;
    private String name;
    private String email;
    private String nameImage;
    private String role;

    public UserSummaryDTO(User user){
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.nameImage = user.getNameImage();
        this.role = user.getRole().getName();
    }

}
