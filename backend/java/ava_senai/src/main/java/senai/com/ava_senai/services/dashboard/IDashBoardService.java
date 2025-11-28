package senai.com.ava_senai.services.dashboard;

import senai.com.ava_senai.domain.dashboard.DashBoardAdmGeneralInfo;
import senai.com.ava_senai.domain.dashboard.DashBoardUserGeneralInfo;

public interface IDashBoardService {
    DashBoardAdmGeneralInfo getDashBoardAdmGeneralInfo();
    DashBoardUserGeneralInfo getDashBoardUserGeneralInfo();
}
