package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.task.feedback.FeedbackRegisterDTO;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.feedback.IFeedbackService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/feedback")
public class FeedbackController {

    private final IFeedbackService feedbackService;

    @PostMapping("/evaluate")
    public ResponseEntity<ApiResponse> getCourseById(@RequestBody @Valid FeedbackRegisterDTO feedbackRegisterDTO) {
        return ResponseEntity.ok().body(new ApiResponse("Sucesso!", feedbackService.evaluate(feedbackRegisterDTO)));
    }

    @GetMapping("/by-response-id/{responseId}")
    public ResponseEntity<ApiResponse> getFeedbackByResponseId(@PathVariable("responseId") @Valid Long responseId) {
        return ResponseEntity.ok().body(new ApiResponse("Sucesso!", feedbackService.getByIdResponse(responseId)));
    }

}

