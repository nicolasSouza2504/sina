package senai.com.ava_senai.domain.task;

import java.util.List;

public record TaskResponseDTO(Long taskId, List<TaskContentResponseDTO> taskContents) {

}
