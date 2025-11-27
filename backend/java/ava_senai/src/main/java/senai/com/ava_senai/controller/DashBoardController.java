package senai.com.ava_senai.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.dashboard.IDashBoardService;

@RestController
@RequestMapping("${api.prefix}/dashboard")
@RequiredArgsConstructor
public class DashBoardController {

    private final IDashBoardService dashBoardService;

    @GetMapping("/adm/general")
    public ResponseEntity<ApiResponse> getAdminGeneralDashboard() {
        return ResponseEntity.ok().body(new ApiResponse("Sucesso!", dashBoardService.getDashBoardAdmGeneralInfo()));
    }

}
