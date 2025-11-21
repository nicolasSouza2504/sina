package senai.com.ava_senai.mapper;

import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.domain.course.clazz.classassessment.*;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.feedback.FeedbackResponseDTO;
import senai.com.ava_senai.domain.task.taskuser.TaskUser;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContentDTO;
import senai.com.ava_senai.domain.user.User;

import java.util.List;

public interface IClassAssessmentMapper {
    ClassAssessmentResponseDTO mapClassAssessment(Class clazz, List<User> users);
    List<UserAssessmentDTO> mapUserAssessment(List<User> users);
    List<TaskUserAssessmentDTO> mapUserTaskAssessment(User user);
    TaskAssessmentDTO mapTaskAssessment(Task task);
    FeedbackResponseDTO mapFeedback(TaskUser taskUser);
    UserResponseAssessmentDTO mapUserResponse(TaskUser taskUser);
    List<UserResponseContentDTO> mapUserResponseContents(UserResponse userResponse);
    ClassAssessmentResponseDTO.CourseSimpleResponseDTO mapCourse(Class clazz);
}
