package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.course.section.SectionRegisterDTO;
import senai.com.ava_senai.domain.course.section.SectionResponseDTO;
import senai.com.ava_senai.exception.UserNotFoundException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.section.ISectionService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/section")
public class SectionController {

    private final ISectionService sectionService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getSectionById(@PathVariable @Valid Long id) {

        try {

            SectionResponseDTO courseResponseDTO = sectionService.getSectionById(id);

            return ResponseEntity.ok().body(new ApiResponse("Sucesso!", courseResponseDTO));

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @PostMapping
    @Secured({"ADMIN", "TEACHER"})
    public ResponseEntity<ApiResponse> addSection(@RequestBody @Valid SectionRegisterDTO courseRegisterDTO) {

        try {

            SectionResponseDTO courseResponse = sectionService.createSection(courseRegisterDTO);

            return ResponseEntity.ok().body(new ApiResponse("Curso registrado com sucesso!", courseResponse));

        } catch (Validation validation) {
            throw validation;
        } catch (Throwable e) {
            return ResponseEntity.status(409).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @Secured({"ADMIN", "TEACHER"})
    @PutMapping("/{courseId}")
    public ResponseEntity<ApiResponse> updateSection(@PathVariable("courseId") Long courseId,
                                                    @RequestBody @Valid SectionRegisterDTO courseRegisterDTO) {

        try {

            SectionResponseDTO courseResponseDTO = sectionService.updateSection(courseRegisterDTO, courseId);

            return ResponseEntity.ok().body(new ApiResponse("Curso editado com sucesso", courseResponseDTO));

        } catch (Exception e) {
            return ResponseEntity.status(409).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @GetMapping
    public ResponseEntity<ApiResponse> listAll() {
        return ResponseEntity.ok().body(new ApiResponse("Usuários", sectionService.getAllSections()));
    }


}
