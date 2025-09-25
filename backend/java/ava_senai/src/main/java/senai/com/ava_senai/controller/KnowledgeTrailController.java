package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrailRegisterDTO;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrailResponseDTO;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.exception.UserNotFoundException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.knowledgetrail.IKnowledgeTrailService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/knowledge-trail")
public class KnowledgeTrailController {

    private final IKnowledgeTrailService knowledgeTrailService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getKnowledgeTrailById(@PathVariable @Valid Long id) {

        try {

            KnowledgeTrailResponseDTO knowledgeTrailResponseDTO = knowledgeTrailService.getKnowledgeTrailById(id);

            return ResponseEntity.ok().body(new ApiResponse("Sucesso!", knowledgeTrailResponseDTO));

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @PostMapping
    @Secured({"ADMIN", "TEACHER"})
    public ResponseEntity<ApiResponse> addKnowledgeTrail(@RequestBody @Valid KnowledgeTrailRegisterDTO sectionRegisterDTO) {

        try {

            KnowledgeTrailResponseDTO knowledgeTrailResponseDTO = knowledgeTrailService.createKnowledgeTrail(sectionRegisterDTO);

            return ResponseEntity.ok().body(new ApiResponse("Trilha de conhecimento registrada com sucesso!", knowledgeTrailResponseDTO));

        } catch (Validation validation) {
            throw validation;
        } catch (Throwable e) {
            return ResponseEntity.status(409).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @Secured({"ADMIN", "TEACHER"})
    @PutMapping("/{sectionId}")
    public ResponseEntity<ApiResponse> updateKnowledgeTrail(@PathVariable("sectionId") Long sectionId,
                                                     @RequestBody @Valid KnowledgeTrailRegisterDTO sectionRegisterDTO) {

        try {

            KnowledgeTrailResponseDTO courseResponseDTO = knowledgeTrailService.updateKnowledgeTrail(sectionRegisterDTO, sectionId);

            return ResponseEntity.ok().body(new ApiResponse("Trilha de conhecimento editada com sucesso", courseResponseDTO));

        } catch (Exception e) {
            return ResponseEntity.status(409).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @GetMapping
    public ResponseEntity<ApiResponse> listAll() {

        try {
            return ResponseEntity.ok().body(new ApiResponse("Trilhas de conhecimento", knowledgeTrailService.getAllKnowledgeTrails()));
        }  catch (NullListException ex) {
            return ResponseEntity.status(202).body(new ApiResponse(ex.getMessage(), null));
        }

    }


}
