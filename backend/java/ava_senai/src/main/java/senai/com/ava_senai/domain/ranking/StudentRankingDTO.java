package senai.com.ava_senai.domain.ranking;


public record StudentRankingDTO(String name, Integer place, Double conclusionPercent, Integer tasksSent, Integer tasksReviewed, Integer totalTasks, Double mediumGrade, String lastResponse) {
}
