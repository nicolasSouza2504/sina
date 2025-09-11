package senai.com.ava_senai.setup;

import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.role.Role;
import senai.com.ava_senai.domain.user.UserRegisterDTO;
import senai.com.ava_senai.repository.RolesRepository;
import senai.com.ava_senai.services.user.IUserService;

import java.util.List;

@Component
@Service
public class DataInitializer implements CommandLineRunner {


    private final IUserService iUserService;
    private final RolesRepository rolesRepository;

    public DataInitializer(IUserService iUserService, RolesRepository rolesRepository ) {

        this.iUserService = iUserService;
        this.rolesRepository = rolesRepository;

    }

    @Override
    public void run(String... args) throws Exception {

        try {

            createRoles();
            createUser();

        } catch (Exception e) {}

    }

    @Transactional
    public void createRoles() {

        List<Role> defaultRoles = buildDefaultRoles();

        defaultRoles.stream().forEach(role -> {

            if (!existsRole(role.getName())) {
                rolesRepository.save(role);
            }

        });

    }

    private List<Role> buildDefaultRoles() {
        return List.of(new Role("ADMIN"),
                new Role("TEACHER"),
                new Role("USER"));
    }

    public void createUser() {

        UserRegisterDTO userRegister = buildDefaultAdmin();

        iUserService.createUser(userRegister);

    }

    private UserRegisterDTO buildDefaultAdmin() {
        return new UserRegisterDTO("admin",
                "admin@gmail.com",
                "admin@65468*/62.98+/*52989856*//*/",
                "00000000000",
                null,
                rolesRepository.findById(Long.valueOf(1)).get(),
                null);
    }

    public Boolean existsRole(String roleStr) {
        return !rolesRepository.findByName(roleStr).isEmpty();
    }

}
