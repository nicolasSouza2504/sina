package senai.com.ava_senai.services.ranking;

import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.ranking.StudentRankingDTO;
import senai.com.ava_senai.domain.ranking.UserRankingCalculatorDTO;

import java.util.List;

@Service
public class RankingCalculatorService implements IRankingCalculatorService {

    @Override
    public List<StudentRankingDTO> calculate(List<UserRankingCalculatorDTO> usersRanking) {
        return List.of();
    }

}
