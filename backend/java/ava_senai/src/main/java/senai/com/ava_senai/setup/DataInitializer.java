package senai.com.ava_senai.setup;

import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.course.institution.Institution;
import senai.com.ava_senai.domain.user.role.Role;
import senai.com.ava_senai.domain.user.UserRegisterDTO;
import senai.com.ava_senai.exception.UserAlreadyExistsException;
import senai.com.ava_senai.repository.InstitutionRepository;
import senai.com.ava_senai.repository.RolesRepository;
import senai.com.ava_senai.services.user.IUserService;

import java.util.List;
import java.util.Optional;

@Component
@Service
public class DataInitializer implements CommandLineRunner {


    private final IUserService iUserService;
    private final RolesRepository rolesRepository;
    private final InstitutionRepository institutionRepository;

    public DataInitializer(IUserService iUserService, RolesRepository rolesRepository, InstitutionRepository institutionRepository) {

        this.iUserService = iUserService;
        this.rolesRepository = rolesRepository;
        this.institutionRepository = institutionRepository;

    }

    @Override
    public void run(String... args) throws Exception {

        try {
            createInstitution();
        } catch (Exception e) {
        }

        try {
            createRoles();
        } catch (Exception e) {}

        try {
            createUser();
        } catch (Exception e) {
        }

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
                new Role("STUDENT"));
    }

    @Transactional
    public void createUser() {

        UserRegisterDTO userRegister = buildDefaultAdmin();

        iUserService.createUser(userRegister);

    }

    @Transactional
    public void createInstitution() {

        Institution institution = new Institution();

        institution.setInstitutionName("SENAI_JOINVILLE");

        Optional.of(institution)
                        .filter(inst -> !institutionRepository.existsByInstitutionName("SENAI_JOINVILLE"))
                        .map(req -> institutionRepository.save(institution))
                        .orElseThrow(() -> new UserAlreadyExistsException("Oops! User already exists!"));
    }

    private UserRegisterDTO buildDefaultAdmin() {
        return new UserRegisterDTO("admin",
                "admin@gmail.com",
                "admin",
                "00000000000",
                null,
                rolesRepository.findById(Long.valueOf(1)).get(),
                null,
                1l);
    }

    public Boolean existsRole(String roleStr) {
        return !rolesRepository.findByName(roleStr).isEmpty();
    }

}
