package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.course.clazz.ClassRegisterDTO;
import senai.com.ava_senai.domain.course.clazz.ClassResponseDTO;
import senai.com.ava_senai.exception.AlreadyExistsException;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.clazz.ClassService;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/class")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @Secured({"TEACHER", "ADMIN"})
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addClass(@RequestBody @Valid ClassRegisterDTO turma) {

        try {

            ClassResponseDTO newTurma = classService.createClass(turma);

            return ResponseEntity.ok()
                    .body(new ApiResponse("Turma adicionada Com sucesso!", newTurma));

        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(409).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllClasses() {

        try {

            List<ClassResponseDTO> listTurmas = classService.getTurmas();

            return ResponseEntity.ok().body(new ApiResponse("Sucesso", listTurmas));

        } catch (NullListException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @PutMapping("/{classId}/edit")
    public ResponseEntity<ApiResponse> editClass(@PathVariable Long classId, @RequestBody @Valid ClassRegisterDTO turma) {

        try {

            ClassResponseDTO updatedTurma = classService.updateClass(turma, classId);

            return ResponseEntity.ok().body(new ApiResponse("Turma editado com sucesso!", updatedTurma));

        } catch (NotFoundException | AlreadyExistsException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @DeleteMapping("/delete/{classId}")
    public ResponseEntity<ApiResponse> deleteClass(@PathVariable Long classId) {

        try {

            classService.deleteTurma(classId);

            return ResponseEntity.ok().body(new ApiResponse("Turma deletada com sucesso!", null));

        } catch (NotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @GetMapping("/{classId}/class")
    public ResponseEntity<ApiResponse> getTurmaById(@PathVariable Long classId) {

        try {
            return ResponseEntity.ok().body(new ApiResponse("Sucesso", classService.getTurmaById(classId)));
        } catch (NotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @GetMapping("/{classId}/students-of-and-out-class")
    public ResponseEntity<ApiResponse> getAllStudents(@PathVariable Long classId) {

        try {
            return ResponseEntity.ok().body(new ApiResponse("Sucesso", classService.getTurmaById(classId)));
        } catch (NotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

}
