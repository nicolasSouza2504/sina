package senai.com.ava_senai.controller;


import com.google.gson.Gson;
import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContentRegisterDTO;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContentResponseDTO;
import senai.com.ava_senai.dto.FileData;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.task.IUserResponseContentService;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/user-response-content")
public class UserResponseContentController {

    private final IUserResponseContentService userResponseContentService;

    @Secured({"ADMIN", "TEACHER"})
    @PostMapping("/save")
    public ResponseEntity uploadContent(
            @RequestParam @Valid String userContentStr,
            @RequestParam("file") @Nullable MultipartFile file) throws IOException {

        UserResponseContentResponseDTO userResponseContent = userResponseContentService.saveUserResponseContent(new Gson().fromJson(userContentStr, UserResponseContentRegisterDTO.class), file);

        return ResponseEntity.ok().body(new ApiResponse("Ok", userResponseContent));

    }

    @Secured({"ADMIN", "TEACHER"})
    @GetMapping("/find")
    public ResponseEntity findContentByPath(@RequestParam String filePath) throws Throwable {

        try {


            FileData fileData = userResponseContentService.findContentByPath(filePath);

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

            userResponseContentService.delete(id);

            return ResponseEntity.ok().body(new ApiResponse("Conteúdo da tarefa deletado com sucesso", id));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Error", e.getMessage()));
        }

    }

}
