package senai.com.ava_senai.services.ranking;

import senai.com.ava_senai.domain.ranking.RankingResponseDTO;

import java.util.List;

public interface IRankingService {
    List<RankingResponseDTO> getRankingsClass(Long classId);
}
