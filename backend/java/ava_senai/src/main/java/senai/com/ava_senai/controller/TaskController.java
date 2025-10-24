package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.task.TaskRegisterDTO;
import senai.com.ava_senai.domain.task.TaskResponseDTO;
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
    public ResponseEntity<ApiResponse> addTask(@RequestBody @Valid TaskRegisterDTO taskRegisterDTO) {
        return ResponseEntity.ok().body(new ApiResponse("Tarefas registradas com sucesso!", taskService.createTasks(taskRegisterDTO)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getTasksByKnowledgeTrailId(@PathVariable @Valid Long id) {

        return ResponseEntity.ok().body(new ApiResponse("Sucesso!", taskService.getTaskById(id)));

    }

}
