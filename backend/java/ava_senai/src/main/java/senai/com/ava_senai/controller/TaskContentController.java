package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;
import senai.com.ava_senai.services.task.TaskContentService;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/task-content")
public class TaskContentController {

    private final TaskContentService taskContentService;

    @PostMapping("/save")
    public ResponseEntity<Void> uploadContent(
                    @RequestParam @Valid TaskContentRegisterDTO taskContent,
                    @RequestParam("file") MultipartFile file) throws IOException {

        taskContentService.saveTaskContent(taskContent, file);

        return ResponseEntity.ok().build();

    }

}
