package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.user.student.dto.StudentRecordEditDTO;
import senai.com.ava_senai.domain.user.student.dto.StudentRecordRegisterDTO;
import senai.com.ava_senai.domain.user.student.dto.StudentRecordResponseDTO;
import senai.com.ava_senai.exception.IncorrectRoleException;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.UserNotFoundException;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.user.UserService;
import senai.com.ava_senai.services.user.student.IStudentRecordService;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/userrecord")
@RequiredArgsConstructor
public class UserRecordController {

    private final IStudentRecordService studentRecordService;
    private final UserService userService;

    @GetMapping("/{studentId}")
    public ResponseEntity<ApiResponse> getRecordsByStudentId(@PathVariable @Valid Long studentId, @RequestParam(required = false) Boolean isVisible) {
        try {
            List<StudentRecordResponseDTO> studentRecordDTOList = studentRecordService.getStudentRecords(studentId);

            if (isVisible != null) {
                studentRecordDTOList = studentRecordDTOList.stream().filter(x -> x.getIsVisible().equals(isVisible)).toList();
            }

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
        } catch (IncorrectRoleException e){
            return ResponseEntity.status(422).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @Secured({"ADMIN", "TEACHER"})
    @PatchMapping("edit/{recordId}")
    public ResponseEntity<ApiResponse> editRecord(@PathVariable @Valid Long recordId,
                                                  @RequestBody @Valid StudentRecordEditDTO studentRecord) {
        try {
            StudentRecordResponseDTO studentRecordUpdated = studentRecordService.editStudentRecord(recordId, studentRecord);

            return ResponseEntity.ok()
                    .body(new ApiResponse("Observação adicionada com sucesso!", studentRecordUpdated));

        } catch (NotFoundException | UserNotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        } catch (IncorrectRoleException e){
            return ResponseEntity.status(422).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @Secured({"ADMIN", "TEACHER"})
    @DeleteMapping("delete/{recordId}")
    public ResponseEntity<ApiResponse> deleteRecord(@PathVariable @Valid Long recordId) {
        try {
            studentRecordService.deleteStudentRecord(recordId);

            return ResponseEntity.ok()
                    .body(new ApiResponse("Observação deletada com sucesso!", null));

        } catch (NotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
