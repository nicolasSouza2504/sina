package senai.com.ava_senai.services.ranking;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.ranking.RankingResponseDTO;
import senai.com.ava_senai.domain.ranking.StudentRankingDTO;
import senai.com.ava_senai.domain.ranking.UserRankingCalculatorDTO;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.repository.KnowledgeTrailRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingService implements IRankingService {

    private final KnowledgeTrailRepository knowledgeTrailRepository;
    private final IRankingCalculatorService rankingCalculatorService;
    private final IRankingBuilderService rankingBuilderService;

    @Override
    public List<RankingResponseDTO> getRankingsClass(Long classId, List<Long> knowledgeTrailIds) {

        List<KnowledgeTrail> knowledgeTrails = knowledgeTrailRepository.findRankedKnowledgeTrailsByClassId(classId, knowledgeTrailIds)
                .orElseThrow(() -> new NotFoundException("Nenhuma trilha de conhecimento ranqueada encontrada para a turma"));

        return getRankings(knowledgeTrails, classId);

    }

    private List<RankingResponseDTO> getRankings(List<KnowledgeTrail> knowledgeTrails, Long classId) {
        return knowledgeTrails.stream()
                .map(rankedKnowledgeTrail -> getRanking(rankedKnowledgeTrail, classId))
                .toList();
    }

    private RankingResponseDTO getRanking(KnowledgeTrail rankedKnowledgeTrail, Long classId) {

        RankingResponseDTO rankingResponseDTO = new RankingResponseDTO(rankedKnowledgeTrail);

        List<UserRankingCalculatorDTO> usersRankingCalculator = rankingBuilderService.buildUsersRankingCalculator(classId, rankedKnowledgeTrail.getId());

        List<StudentRankingDTO> studentsRanking = rankingCalculatorService.calculate(usersRankingCalculator);

        rankingResponseDTO.setStudentsRanking(studentsRanking);

        return rankingResponseDTO;

    }

}
