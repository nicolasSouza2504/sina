package senai.com.ava_senai.services.ranking;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.ranking.RankingResponseDTO;
import senai.com.ava_senai.domain.ranking.StudentRankingDTO;
import senai.com.ava_senai.domain.ranking.UserRankingCalculatorDTO;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.repository.KnowledgeTrailRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingService implements IRankingService {

    private final KnowledgeTrailRepository knowledgeTrailRepository;
    private final IRankingCalculatorService rankingCalculatorService;
    private final IRankingBuilderService rankingBuilderService;

    @Override
    public List<RankingResponseDTO> getRankingsClass(Long classId) {

        List<KnowledgeTrail> knowledgeTrails = knowledgeTrailRepository.findRankedKnowledgeTrailsByClassId(classId)
                .orElseThrow(() -> new NotFoundException("Nenhuma trilha de conhecimento ranqueada encontrada para a turma"));

        return getRankings(knowledgeTrails, classId);

    }

    private List<RankingResponseDTO> getRankings(List<KnowledgeTrail> knowledgeTrails, Long classId) {

        List<RankingResponseDTO> rankings = new ArrayList<>();

        for (KnowledgeTrail knowledgeTrail : knowledgeTrails) {
            rankings.add(getRanking(knowledgeTrail, classId));
        }

        return rankings;

    }

    private RankingResponseDTO getRanking(KnowledgeTrail rankedKnowledgeTrail, Long classId) {

        RankingResponseDTO rankingResponseDTO = new RankingResponseDTO(rankedKnowledgeTrail);

        List<UserRankingCalculatorDTO> usersRankingCalculator = rankingBuilderService.buildUsersRankingCalculator(classId, rankedKnowledgeTrail.getId());

        List<StudentRankingDTO> studentsRanking = rankingCalculatorService.calculate(usersRankingCalculator);

        rankingResponseDTO.setStudentsRanking(studentsRanking);

        return rankingResponseDTO;

    }

}
