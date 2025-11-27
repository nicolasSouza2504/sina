package senai.com.ava_senai.services.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.dashboard.DashBoardAdmGeneralInfo;
import senai.com.ava_senai.repository.DashBoardRepository;

@Service
@RequiredArgsConstructor
public class DashBoardService implements IDashBoardService {

    private final DashBoardRepository dashBoardRepository;

    @Override
    public DashBoardAdmGeneralInfo getDashBoardAdmGeneralInfo() {
        return dashBoardRepository.getDashBoardAdmGeneralInfo();
    }

}
