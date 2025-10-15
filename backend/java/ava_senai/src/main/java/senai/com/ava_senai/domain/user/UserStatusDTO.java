package senai.com.ava_senai.domain.user;

import lombok.Data;

@Data
public class UserStatusDTO {
    private String status;

    public UserStatusDTO(String status) {
        this.status = status;
    }
}
