package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.course.section.SectionRegisterDTO;
import senai.com.ava_senai.domain.course.section.SectionResponseDTO;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
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

            SectionResponseDTO sectionResponseDTO = sectionService.getSectionById(id);

            return ResponseEntity.ok().body(new ApiResponse("Sucesso!", sectionResponseDTO));

        } catch (NotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @PostMapping
    @Secured({"ADMIN", "TEACHER"})
    public ResponseEntity<ApiResponse> addSection(@RequestBody @Valid SectionRegisterDTO sectionRegisterDTO) {

        try {

            SectionResponseDTO sectionResponse = sectionService.createSection(sectionRegisterDTO);

            return ResponseEntity.ok().body(new ApiResponse("Sessão registrada com sucesso!", sectionResponse));

        } catch (Validation validation) {
            throw validation;
        } catch (Throwable e) {
            return ResponseEntity.status(409).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @Secured({"ADMIN", "TEACHER"})
    @PutMapping("/{sectionId}")
    public ResponseEntity<ApiResponse> updateSection(@PathVariable("sectionId") Long sectionId,
                                                    @RequestBody @Valid SectionRegisterDTO sectionRegisterDTO) {

        try {

            SectionResponseDTO courseResponseDTO = sectionService.updateSection(sectionRegisterDTO, sectionId);

            return ResponseEntity.ok().body(new ApiResponse("Sessão editada com sucesso", courseResponseDTO));

        } catch (Exception e) {
            return ResponseEntity.status(409).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @GetMapping
    public ResponseEntity<ApiResponse> listAll() {

        try {
            return ResponseEntity.ok().body(new ApiResponse("Sessões", sectionService.getAllSections()));
        }  catch (NullListException ex) {
            return ResponseEntity.status(202).body(new ApiResponse(ex.getMessage(), null));
        }

    }


}
