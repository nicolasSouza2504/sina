package senai.com.ava_senai.domain.task.taskcontent;


import jakarta.validation.constraints.NotNull;

public record TaskContentRegisterDTO(@NotNull(message = "Informe a tarefa associada ao conteúdo") Long taskId, @NotNull(message = "Informe o nome do conteúdo") String name, @NotNull(message = "Informe o content type do arquivo") TaskContentType taskContentType) {
}
