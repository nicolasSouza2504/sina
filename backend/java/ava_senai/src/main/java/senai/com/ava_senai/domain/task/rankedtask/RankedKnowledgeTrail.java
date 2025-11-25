package senai.com.ava_senai.domain.task.rankedtask;

import lombok.Data;

import java.util.List;

@Data
public class RankedKnowledgeTrail {
    private Long id;
    private String name;
    private List<RankedTask> tasks;
}
