package senai.com.ava_senai.domain.task.knowledgetrail;

public record KnowledgeTrailResponseDTO(Long id, String name, Long sectionId, Boolean ranked) {

    public KnowledgeTrailResponseDTO(KnowledgeTrail knowledgeTrail) {
        this(knowledgeTrail.getId(), knowledgeTrail.getName(), knowledgeTrail.getSectionId(), knowledgeTrail.getRanked());
    }
}
