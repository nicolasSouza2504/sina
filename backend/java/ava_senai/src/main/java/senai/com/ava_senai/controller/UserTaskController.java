package senai.com.ava_senai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.task.ITaskUserService;

@RestController
@RequestMapping("${api.prefix}/user-task")
@RequiredArgsConstructor
public class UserTaskController {

    private final ITaskUserService taskUserService;

    @GetMapping("user/{userId}/task/{taskId}")
    public ResponseEntity<ApiResponse> getUserResponseById(@PathVariable @Valid Long userId,
            @PathVariable @Valid Long taskId) throws Exception {
        return ResponseEntity.ok()
                .body(new ApiResponse("Sucesso!", taskUserService.getUserTaskByUserAndTaskId(userId, taskId)));
    }
}