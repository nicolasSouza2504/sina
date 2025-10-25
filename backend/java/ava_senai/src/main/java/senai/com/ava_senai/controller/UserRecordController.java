package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.user.student.StudentRecordRegisterDTO;
import senai.com.ava_senai.domain.user.student.StudentRecordResponseDTO;
import senai.com.ava_senai.exception.UserNotFoundException;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.user.student.IStudentRecordService;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/userrecord")
@RequiredArgsConstructor
public class UserRecordController {

    private final IStudentRecordService studentRecordService;

    @GetMapping("/{studentId}")
    public ResponseEntity<ApiResponse> getRecordsByStudentId(@PathVariable @Valid Long studentId) {

        try {

            List<StudentRecordResponseDTO> studentRecordDTOList = studentRecordService.getStudentRecords(studentId);

            return ResponseEntity.ok().body(new ApiResponse("Sucesso!", studentRecordDTOList));

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @Secured({"ADMIN", "TEACHER"})
    @PostMapping("add")
    public ResponseEntity<ApiResponse> addRecordToUser(@RequestBody @Valid StudentRecordRegisterDTO studentRecord) {
        try {

            StudentRecordResponseDTO newStudentRecord = studentRecordService.createStudentRecord(studentRecord);
            return ResponseEntity.ok()
                    .body(new ApiResponse("Observação adicionada com sucesso!", newStudentRecord));

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

}
