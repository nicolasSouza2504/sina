package senai.com.ava_senai.domain.user;

import lombok.Data;

@Data
public class UserRegisterData {
    private String name;
    private String email;
    private String senha;
}
