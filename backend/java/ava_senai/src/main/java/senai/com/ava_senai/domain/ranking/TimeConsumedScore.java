package senai.com.ava_senai.domain.ranking;

public enum TimeConsumedScore {

    GREATER_THAN_98(98, 0d),
    GREATER_THAN_90(90, 5d),
    GREATER_THAN_75(75, 10d),
    GREATER_THAN_50(50, 15d),
    GREATER_THAN_25(25, 20d),
    LESS_OR_EQUAL_25(0, 25d);

    private final double threshold;
    private final double points;

    TimeConsumedScore(double threshold, double points) {
        this.threshold = threshold;
        this.points = points;
    }

    public static Double valueOf(double mediumPercentTimeConsumed) {
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
