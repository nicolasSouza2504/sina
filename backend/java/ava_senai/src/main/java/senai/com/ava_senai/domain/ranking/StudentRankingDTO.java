package senai.com.ava_senai.domain.ranking;


import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class StudentRankingDTO {
    private String name;
    private Double conclusionPercent;
    private Integer tasksSent;
    private Integer tasksReviewed;
    private Integer totalTasks;
    private Double mediumGrade;
    private Date lastResponseDate;
    private Double pointsEarned;
    private Integer place;

    public StudentRankingDTO() {

    }

}
