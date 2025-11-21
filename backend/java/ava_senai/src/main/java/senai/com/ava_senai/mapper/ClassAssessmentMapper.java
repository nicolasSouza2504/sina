package senai.com.ava_senai.mapper;

import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.domain.course.clazz.classassessment.*;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.feedback.Feedback;
import senai.com.ava_senai.domain.task.feedback.FeedbackResponseDTO;
import senai.com.ava_senai.domain.task.taskuser.TaskUser;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContentDTO;
import senai.com.ava_senai.domain.user.User;

import java.util.ArrayList;
import java.util.List;

@Component
public class ClassAssessmentMapper implements IClassAssessmentMapper {

    @Override
    public ClassAssessmentResponseDTO mapClassAssessment(Class clazz, List<User> users) {

        ClassAssessmentResponseDTO classAssessmentResponseDTO = new ClassAssessmentResponseDTO();

        classAssessmentResponseDTO.setId(clazz.getId());
        classAssessmentResponseDTO.setNome(clazz.getName());
        classAssessmentResponseDTO.setStartDate(clazz.getStartDate());
        classAssessmentResponseDTO.setFinalDate(clazz.getEndDate());
        classAssessmentResponseDTO.setImgClass(clazz.getImgClass());
        classAssessmentResponseDTO.setSemester(clazz.getSemester());
        classAssessmentResponseDTO.setCode(clazz.getCode());
        classAssessmentResponseDTO.setCourse(mapCourse(clazz));
        classAssessmentResponseDTO.setUsers(mapUserAssessment(users));

        return classAssessmentResponseDTO;

    }

    @Override
    public List<UserAssessmentDTO> mapUserAssessment(List<User> users) {

        List<UserAssessmentDTO> usersAssessmentDTO = new ArrayList<>();

        if (!CollectionUtils.isEmpty(users)) {

            users.forEach(user -> {

                UserAssessmentDTO userAssessmentDTO = new UserAssessmentDTO();

                userAssessmentDTO.setId(user.getId());
                userAssessmentDTO.setEmail(user.getEmail());
                userAssessmentDTO.setNome(user.getName());
                userAssessmentDTO.setStatus(user.getUserStatus());
                userAssessmentDTO.setRole(user.getRole());
                userAssessmentDTO.setInstitutionName(user.getInstitution().getInstitutionName());
                userAssessmentDTO.setCpf(user.getCpf());
                userAssessmentDTO.setTasksAssessment(mapUserTaskAssessment(user));

                usersAssessmentDTO.add(userAssessmentDTO);

            });

        }

        return usersAssessmentDTO;

    }

    @Override
    public List<TaskUserAssessmentDTO> mapUserTaskAssessment(User user) {

        List<TaskUserAssessmentDTO> tasksAssessmentDTO = new ArrayList<>();

        if (!CollectionUtils.isEmpty(user.getTaskUsers())) {

            user.getTaskUsers().forEach(taskUser -> {

                TaskUserAssessmentDTO taskUserAssessmentDTO = new TaskUserAssessmentDTO();

                taskUserAssessmentDTO.setTaskId(taskUser.getTaskId());
                taskUserAssessmentDTO.setIdUser(taskUser.getUserId());
                taskUserAssessmentDTO.setId(taskUser.getId());
                taskUserAssessmentDTO.setTask(mapTaskAssessment(taskUser.getTask()));
                taskUserAssessmentDTO.setUserResponse(mapUserResponse(taskUser));
                taskUserAssessmentDTO.setFeedback(mapFeedback(taskUser));
                tasksAssessmentDTO.add(taskUserAssessmentDTO);

            });

        }

        return tasksAssessmentDTO;

    }

    @Override
    public TaskAssessmentDTO mapTaskAssessment(Task task) {

        TaskAssessmentDTO taskAssessmentDTO = null;

        if (task != null) {
            taskAssessmentDTO = new TaskAssessmentDTO();
            taskAssessmentDTO.setId(task.getId());
            taskAssessmentDTO.setName(task.getName());
            taskAssessmentDTO.setDescription(task.getDescription());
            taskAssessmentDTO.setDueDate(task.getDueDate());
            taskAssessmentDTO.setKnowledgeTrailId(task.getKnowledgeTrailId());
        }

        return taskAssessmentDTO;

    }

    @Override
    public FeedbackResponseDTO mapFeedback(TaskUser taskUser) {

        FeedbackResponseDTO feedbackResponseDTO = null;

        if (taskUser.getUserResponse() != null && taskUser.getUserResponse().getFeedback() != null) {

            Feedback feedback = taskUser.getUserResponse().getFeedback();

            feedbackResponseDTO = new FeedbackResponseDTO(feedback);

        }

        return feedbackResponseDTO;

    }

    @Override
    public UserResponseAssessmentDTO mapUserResponse(TaskUser taskUser) {

        UserResponseAssessmentDTO userResponseAssessmentDTO = null;

        if (taskUser.getUserResponse() != null) {

            UserResponse userResponse = taskUser.getUserResponse();

            userResponseAssessmentDTO = new UserResponseAssessmentDTO();
            userResponseAssessmentDTO.setId(userResponse.getId());
            userResponseAssessmentDTO.setComment(userResponse.getComment());
            userResponseAssessmentDTO.setContents(mapUserResponseContents(userResponse));

        }

        return userResponseAssessmentDTO;

    }

    @Override
    public List<UserResponseContentDTO> mapUserResponseContents(UserResponse userResponse) {

        List<UserResponseContentDTO> userResponseContents = new ArrayList<>();

        if (!CollectionUtils.isEmpty(userResponse.getUserResponseContents())) {

            userResponse.getUserResponseContents().forEach(userResponseContent -> {
                userResponseContents.add(new UserResponseContentDTO(userResponseContent.getContentType(), userResponseContent.getName(), userResponseContent.getContentUrl()));
            });

        }

        return userResponseContents;

    }

    @Override
    public ClassAssessmentResponseDTO.CourseSimpleResponseDTO mapCourse(Class clazz) {

        ClassAssessmentResponseDTO.CourseSimpleResponseDTO courseSimpleResponseDTO = null;

        if (clazz.getCourse() != null) {

            courseSimpleResponseDTO = new ClassAssessmentResponseDTO.CourseSimpleResponseDTO();

            courseSimpleResponseDTO.setName(clazz.getCourse().getName());
            courseSimpleResponseDTO.setId(clazz.getCourse().getId());

        }

        return courseSimpleResponseDTO;

    }

}
