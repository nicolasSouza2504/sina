package senai.com.ava_senai.controller;

import com.google.gson.Gson;
import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.TaskContentResponseDTO;
import senai.com.ava_senai.domain.task.taskcontent.TaskContentRegisterDTO;
import senai.com.ava_senai.dto.FileData;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.task.TaskContentService;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/task-content")
public class TaskContentController {

    private final TaskContentService taskContentService;

    @Secured({"ADMIN", "TEACHER"})
    @PostMapping("/save")
    public ResponseEntity uploadContent(
            @RequestParam @Valid String taskContentStr,
            @RequestParam("file") @Nullable MultipartFile file) throws IOException {

        TaskContentResponseDTO taskContentResponesDTO = taskContentService.saveTaskContent(new Gson().fromJson(taskContentStr, TaskContentRegisterDTO.class), file);

        return ResponseEntity.ok().body(new ApiResponse("Ok", taskContentResponesDTO));

    }

    @Secured({"ADMIN", "TEACHER"})
    @GetMapping("/find")
    public ResponseEntity findContentByPath(@RequestParam String filePath) {

        try {

            FileData fileData = taskContentService.findContentByPathWithMetadata(filePath);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, fileData.getMimeType())
                    .body(fileData.getBytes());

        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Error", e.getMessage()));
        }

    }


    @Secured({"ADMIN", "TEACHER"})
    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable("id") Long id) {

        try {

            taskContentService.delete(id);

            return ResponseEntity.ok().body(new ApiResponse("Conteúdo da tarefa deletado com sucesso", id));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Error", e.getMessage()));
        }

    }

}
