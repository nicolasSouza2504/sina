package senai.com.ava_senai.mapper;

import senai.com.ava_senai.domain.course.clazz.Class;
import senai.com.ava_senai.domain.course.clazz.classassessment.ClassAssessmentResponseDTO;
import senai.com.ava_senai.domain.user.User;

import java.util.List;

public interface IClassAssessmentMapper {
    ClassAssessmentResponseDTO mapClassAssessment(Class clazz, List<User> users);
}
