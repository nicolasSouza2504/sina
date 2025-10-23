package senai.com.ava_senai.controller;

import com.google.gson.Gson;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.TaskContentResponseDTO;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.task.TaskContentService;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/task-content")
public class TaskContentController {

    private final TaskContentService taskContentService;

    @PostMapping("/save")
    public ResponseEntity uploadContent(
                    @RequestParam @Valid String taskContentStr,
                    @RequestParam("file") MultipartFile file) throws IOException {

        TaskContentResponseDTO taskContentResponesDTO = taskContentService.saveTaskContent(new Gson().fromJson(taskContentStr, TaskContentRegisterDTO.class), file);

        return ResponseEntity.ok().body(new ApiResponse("Ok", taskContentResponesDTO));

    }

}
