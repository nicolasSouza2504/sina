package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import senai.com.ava_senai.domain.task.TaskRegisterDTO;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.task.TaskService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/task")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @Secured({"ADMIN", "TEACHER"})
    public ResponseEntity<ApiResponse> addSection(@RequestBody @Valid List<TaskRegisterDTO>  tasksRegisterDTOS) throws Exception {
        return ResponseEntity.ok().body(new ApiResponse("Tarefas registradas com sucesso!", taskService.createTasks(tasksRegisterDTOS)));
    }

}
