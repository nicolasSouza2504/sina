package senai.com.ava_senai.domain.task.ranking;

import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.NotFound;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.repository.KnowledgeTrailRepository;
import senai.com.ava_senai.repository.TaskUserRepository;
import senai.com.ava_senai.repository.UserRepository;
import senai.com.ava_senai.services.ranking.RankingResponseDTO;
import senai.com.ava_senai.services.ranking.StudentRankingDTO;
import senai.com.ava_senai.services.ranking.UserRankingCalculatorDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RankingService implements IRankingService {

    private final KnowledgeTrailRepository knowledgeTrailRepository;
    private final UserRepository userRepository;

    @Override
    public List<RankingResponseDTO> getRankingsClass(Long classId) {

        List<KnowledgeTrail> knowledgeTrails = knowledgeTrailRepository.findRankedKnowledgeTrailsByClassId(classId)
                .orElseThrow(() -> new NotFoundException("Nenhuma trilha de conhecimento ranqueada encontrada para a turma"));

        return buildRankings(knowledgeTrails, classId);

    }

    private List<RankingResponseDTO> buildRankings(List<KnowledgeTrail> knowledgeTrails, Long classId) {

        List<RankingResponseDTO> rankings = new ArrayList<>();

        for (KnowledgeTrail knowledgeTrail : knowledgeTrails) {
            rankings.add(buildRanking(knowledgeTrail, classId));
        }

        return rankings;

    }

    private RankingResponseDTO buildRanking(KnowledgeTrail rankedKnowledgeTrail, Long classId) {

        RankingResponseDTO rankingResponseDTO = new RankingResponseDTO(rankedKnowledgeTrail);

        rankingResponseDTO.setStudentsRanking(buildStudentsRanking(rankedKnowledgeTrail, classId));

        return rankingResponseDTO;

    }

    private List<StudentRankingDTO> buildStudentsRanking(KnowledgeTrail rankedKnowledgeTrail, Long classId) {

        List<UserRankingCalculatorDTO> userRankingCalculator = getUsersRankingCalculator(classId, rankedKnowledgeTrail.getId());

        return null;

    }

    private List<UserRankingCalculatorDTO> getUsersRankingCalculator(Long classId, Long knowledgeTrailId) {

        List<User> usersRankingCalculator = userRepository.findUsersRanking(classId, knowledgeTrailId);

        return new ArrayList<>();

    }

}
