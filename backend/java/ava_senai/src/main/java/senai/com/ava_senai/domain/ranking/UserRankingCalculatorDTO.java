package senai.com.ava_senai.domain.ranking;

import lombok.Data;
import senai.com.ava_senai.domain.user.User;

import java.util.List;

@Data
public class UserRankingCalculatorDTO {

    User user;
    List<TaskRankingCalculatorDTO> tasksCalculator;

    public UserRankingCalculatorDTO(List<TaskRankingCalculatorDTO> tasksCalculator, User user) {
        this.tasksCalculator = tasksCalculator;
    }

}
