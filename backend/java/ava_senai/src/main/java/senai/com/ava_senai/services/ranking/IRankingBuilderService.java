
package senai.com.ava_senai.services.ranking;

import senai.com.ava_senai.domain.ranking.UserRankingCalculatorDTO;

import java.util.List;

public interface IRankingBuilderService {
    List<UserRankingCalculatorDTO> buildUsersRankingCalculator(Long classId, Long knowledgeTrailId);
}
