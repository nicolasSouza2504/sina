package senai.com.ava_senai.handler.requesthandler.security.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import senai.com.ava_senai.domain.course.institution.Institution;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.domain.user.role.Role;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthyUserDetails implements UserDetails {

    private Long id;
    private String email;
    private String senha;
    private String name;
    private Long idInstitution;
    private List<GrantedAuthority> authorities;
    private Role role;
    private Institution institution;
    private String cpf;
    private String userImage;

    public static AuthyUserDetails buildUserDetails(User user) {

        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole().getName()));

        return new AuthyUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getName(),
                user.getIdInstitution(),
                authorities,
                user.getRole(),
                user.getInstitution(),
                user.getCpf(),
                user.getNameImage());

    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public String getName(){
        return name;
    }
    public String getCpf(){return cpf;}

    public Role getRole(){return role;}

    public Institution getInstitution(){return institution;}
    public String getUserImage(){return  userImage;}

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
