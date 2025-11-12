package senai.com.ava_senai.services.ranking;


import lombok.Data;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;

import java.util.List;

@Data
public class RankingResponseDTO {

    private String name;
    private Long knowledgeTrailId;
    private List<StudentRankingDTO> studentsRanking;

    public RankingResponseDTO(KnowledgeTrail rankedKnowledgeTrail) {
        this.name = rankedKnowledgeTrail.getName();
        this.knowledgeTrailId = rankedKnowledgeTrail.getId();
    }

}
