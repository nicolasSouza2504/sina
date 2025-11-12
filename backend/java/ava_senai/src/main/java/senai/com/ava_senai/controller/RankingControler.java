package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import senai.com.ava_senai.domain.task.ranking.IRankingService;
import senai.com.ava_senai.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/ranking")
public class RankingControler {

    private final IRankingService rankingService;

    @GetMapping("/by-class/{classId}")
    public ResponseEntity<ApiResponse> getFeedbackByResponseId(@PathVariable("classId") @Valid Long classId) {
        return ResponseEntity.ok().body(new ApiResponse("Sucesso!", rankingService.getRankingsClass(classId)));
    }


}
