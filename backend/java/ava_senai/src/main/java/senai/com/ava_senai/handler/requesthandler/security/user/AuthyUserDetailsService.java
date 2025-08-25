package senai.com.ava_senai.handler.requesthandler.security.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.repository.UserRepository;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AuthyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));

        return AuthyUserDetails.buildUserDetails(user);

    }

}
