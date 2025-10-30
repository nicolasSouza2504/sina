package senai.com.ava_senai.domain.task;

public enum Dificuldade {
    FACIL(1),
    MEDIO(1.5),
    DIFICIL(2);

    double value;

    Dificuldade(double value) {
        this.value = value;
    }

}
