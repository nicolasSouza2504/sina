package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrailRegisterDTO;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrailResponseDTO;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
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

        } catch (NotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @PostMapping
    @Secured({"ADMIN", "TEACHER"})
    public ResponseEntity<ApiResponse> addKnowledgeTrail(@RequestBody @Valid KnowledgeTrailRegisterDTO knowledgeTrailRegisterDTO) {

        try {

            KnowledgeTrailResponseDTO knowledgeTrailResponseDTO = knowledgeTrailService.    createKnowledgeTrail(knowledgeTrailRegisterDTO);

            return ResponseEntity.ok().body(new ApiResponse("Trilha de conhecimento registrada com sucesso!", knowledgeTrailResponseDTO));

        } catch (Validation validation) {
            throw validation;
        } catch (Throwable e) {
            return ResponseEntity.status(400).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @Secured({"ADMIN", "TEACHER"})
    @PutMapping("/{knowledgeTrailId}")
    public ResponseEntity<ApiResponse> updateKnowledgeTrail(@PathVariable("knowledgeTrailId") Long knowledgeTrailId,
                                                     @RequestBody @Valid KnowledgeTrailRegisterDTO knowledgeTrailRegisterDTO) {

        try {

            KnowledgeTrailResponseDTO knowledgeTrailResponseDTO = knowledgeTrailService.updateKnowledgeTrail(knowledgeTrailRegisterDTO, knowledgeTrailId);

            return ResponseEntity.ok().body(new ApiResponse("Trilha de conhecimento editada com sucesso", knowledgeTrailResponseDTO));

        } catch (Validation validation) {
            throw validation;
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @GetMapping
    public ResponseEntity<ApiResponse> listAll() {

        try {
            return ResponseEntity.ok().body(new ApiResponse("Trilhas de conhecimento", knowledgeTrailService.getAllKnowledgeTrails()));
        }  catch (NullListException ex) {
            return ResponseEntity.status(404).body(new ApiResponse(ex.getMessage(), null));
        }

    }


}
