package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.task.userresponse.UserResponseRegisterDTO;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.task.IUserResponseService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/user-response")
public class UserResponseController {

    private final IUserResponseService userResponseService;

    @PostMapping
    @Secured({"ADMIN", "TEACHER"})
    public ResponseEntity<ApiResponse> addUserResponse(@RequestBody @Valid UserResponseRegisterDTO userResponseRegisterDTO) throws Exception {
        return ResponseEntity.ok().body(new ApiResponse("Tarefas registradas com sucesso!", userResponseService.createUserResponse(userResponseRegisterDTO)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserResponseById(@PathVariable @Valid Long id) throws Exception {
        return ResponseEntity.ok().body(new ApiResponse("Sucesso!", userResponseService.getUserResponseById(id)));
    }

    @GetMapping("/summary/{id}")
    public ResponseEntity<ApiResponse> getUserResponseSummaryById(@PathVariable @Valid Long id) {
        return ResponseEntity.ok().body(new ApiResponse("Sucesso!", userResponseService.getUserResponseSummaryById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUserResponseById(@PathVariable @Valid Long id) {

        userResponseService.deleteUserResponse(id);

        return ResponseEntity.ok().body(new ApiResponse("Sucesso!", null));

    }

}
