package senai.com.ava_senai.controller;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.services.ranking.IRankingService;
import senai.com.ava_senai.response.ApiResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/ranking")
public class RankingControler {

    private final IRankingService rankingService;

    @GetMapping("/by-class/{classId}")
    public ResponseEntity<ApiResponse> getFeedbackByResponseId(@PathVariable("classId") @Valid Long classId,
                                                               @RequestParam("knowledgeTrailIds") @Nullable List<Long> knowledgeTrailIds) {
        return ResponseEntity.ok().body(new ApiResponse("Sucesso!", rankingService.getRankingsClass(classId, knowledgeTrailIds)));
    }


}
