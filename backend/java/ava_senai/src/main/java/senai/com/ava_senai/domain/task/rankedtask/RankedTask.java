package senai.com.ava_senai.domain.task.rankedtask;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class RankedTask {
    private String name;
    private Long id;
    private String description;
    private Date startDate;
    private Long quantitySubmissions;
    private Date lastSubmission;
    private Long knowledgeTrailId;
    private String knowledgeTrailName;
}
