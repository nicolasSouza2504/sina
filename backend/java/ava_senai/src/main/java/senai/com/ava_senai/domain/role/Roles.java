package senai.com.ava_senai.domain.role;

public enum Roles {

    ADMIN(1, "Administrador"), TEACHER(2, "Professor"), USER(3, "Usuário");

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
