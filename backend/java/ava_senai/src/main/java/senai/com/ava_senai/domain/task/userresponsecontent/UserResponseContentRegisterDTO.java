package senai.com.ava_senai.domain.task.userresponsecontent;

import jakarta.validation.constraints.NotNull;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentType;

public record UserResponseContentRegisterDTO(@NotNull(message = "Informe a resposta associada ao conteúdo") Long userResponseId, @NotNull(message = "Informe o nome do conteúdo") String name, @NotNull(message = "Informe o content type do arquivo") TaskContentType contentType, String link) {
}
