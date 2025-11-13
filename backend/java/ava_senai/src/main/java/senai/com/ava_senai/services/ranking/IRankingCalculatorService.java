package senai.com.ava_senai.services.ranking;

import senai.com.ava_senai.domain.ranking.StudentRankingDTO;
import senai.com.ava_senai.domain.ranking.UserRankingCalculatorDTO;

import java.util.List;

public interface IRankingCalculatorService {
    List<StudentRankingDTO> calculate(List<UserRankingCalculatorDTO> usersRanking);
}

