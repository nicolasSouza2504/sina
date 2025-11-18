package senai.com.ava_senai.domain.ranking;

public enum TimeConsumedScore {

    GREATER_THAN_98(98, 0),
    GREATER_THAN_90(90, 5),
    GREATER_THAN_75(75, 10),
    GREATER_THAN_50(50, 15),
    GREATER_THAN_25(25, 20),
    LESS_OR_EQUAL_25(0, 25);

    private final double threshold;
    private final int points;

    TimeConsumedScore(double threshold, int points) {
        this.threshold = threshold;
        this.points = points;
    }

    public static int valueOf(double mediumPercentTimeConsumed) {
        // Ordem importa: do maior para o menor
        for (TimeConsumedScore score : values()) {
            if (mediumPercentTimeConsumed > score.threshold) {
                return score.points;
            }
        }
        // Se por algum motivo não entrar em nada (ex.: valor negativo),
        // você pode decidir retornar o pior caso ou lançar exceção.
        return LESS_OR_EQUAL_25.points;
    }


}
