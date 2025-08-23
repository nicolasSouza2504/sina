package senai.com.ava_senai.domain.Role;

public enum Roles {

    ADMIN(1, "Administrador"), USER(2, "Usuário"), TEACHER(3, "Professor");

    private long value;
    private String description;

    Roles(long value, String desc) {
        this.value = value;
        this.description = desc;
    }

    public long getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

}
