package senai.com.ava_senai.services.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.dashboard.DashBoardAdmGeneralInfo;
import senai.com.ava_senai.domain.dashboard.DashBoardUserGeneralInfo;
import senai.com.ava_senai.domain.task.TaskResponseDTO;
import senai.com.ava_senai.handler.requesthandler.security.user.AuthyUserDetails;
import senai.com.ava_senai.repository.DashBoardRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashBoardService implements IDashBoardService {

    private final DashBoardRepository dashBoardRepository;

    @Override
    public DashBoardAdmGeneralInfo getDashBoardAdmGeneralInfo() {
        return dashBoardRepository.getDashBoardAdmGeneralInfo();
    }

    @Override
    public DashBoardUserGeneralInfo getDashBoardUserGeneralInfo() {

        DashBoardUserGeneralInfo dashBoardUserGeneralInfo = new DashBoardUserGeneralInfo();

        List<TaskResponseDTO> waitingFeedbackTasks = dashBoardRepository.findWaitingFeedbackTasks(getUserId());
        List<TaskResponseDTO> pendingTasks = dashBoardRepository.findPendingTasks(getUserId());
        List<TaskResponseDTO> evaluatedTasks = dashBoardRepository.findEvaluatedTasks(getUserId());

        dashBoardUserGeneralInfo.setWaitingFeedbackTasks(waitingFeedbackTasks);
        dashBoardUserGeneralInfo.setPendingTasks(pendingTasks);
        dashBoardUserGeneralInfo.setEvaluatedTasks(evaluatedTasks);

        return dashBoardUserGeneralInfo;

    }

    public Long getUserId() {

        Long userId = null;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            Object principal = auth.getPrincipal();
            if (principal instanceof AuthyUserDetails user) {
                userId = user.getId();
            }
        }

        return userId;

    }

}
