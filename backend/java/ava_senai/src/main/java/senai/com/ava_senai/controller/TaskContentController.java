package senai.com.ava_senai.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentUploadDTO;
import senai.com.ava_senai.services.task.TaskContentService;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/task-content")
public class TaskContentController {

    private final TaskContentService taskContentService;

    @PostMapping("/upload")
    public ResponseEntity<Void> uploadContent(
            @RequestParam("identifier") String identifier,
            @RequestParam("file") MultipartFile file) throws IOException {

        TaskContentUploadDTO uploadDTO = new TaskContentUploadDTO(
                identifier,
                file.getBytes(),
                file.getContentType()
        );

        taskContentService.uploadContent(uploadDTO);

        return ResponseEntity.ok().build();

    }

}
