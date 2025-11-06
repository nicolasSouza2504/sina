package senai.com.ava_senai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import senai.com.ava_senai.domain.course.CourseContentSummaryDTO;
import senai.com.ava_senai.domain.course.CourseRegisterDTO;
import senai.com.ava_senai.domain.course.CourseResponseDTO;
import senai.com.ava_senai.exception.UserNotFoundException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.response.ApiResponse;
import senai.com.ava_senai.services.course.ICourseService;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/course")
@RequiredArgsConstructor
public class CourseController {

    private final ICourseService courseService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCourseById(@PathVariable @Valid Long id) {

        try {

            CourseResponseDTO courseResponseDTO = courseService.getCourseById(id);

            return ResponseEntity.ok().body(new ApiResponse("Sucesso!", courseResponseDTO));

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @PostMapping
    @Secured({"ADMIN", "TEACHER"})
    public ResponseEntity<ApiResponse> addCourse(@RequestBody @Valid CourseRegisterDTO courseRegisterDTO) {

        try {

            CourseResponseDTO courseResponse = courseService.createCourse(courseRegisterDTO);

            return ResponseEntity.ok().body(new ApiResponse("Curso registrado com sucesso!", courseResponse));

        } catch (Validation validation) {
            throw validation;
        } catch (Throwable e) {
            return ResponseEntity.status(409).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @Secured({"ADMIN", "TEACHER"})
    @PutMapping("/{courseId}")
    public ResponseEntity<ApiResponse> updateCourse(@PathVariable("courseId") Long courseId,
                                               @RequestBody @Valid CourseRegisterDTO courseRegisterDTO) {

        try {

            CourseResponseDTO courseResponseDTO = courseService.updateCourse(courseRegisterDTO, courseId);

            return ResponseEntity.ok().body(new ApiResponse("Curso editado com sucesso", courseResponseDTO));

        } catch (Exception e) {
            return ResponseEntity.status(409).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @GetMapping
    public ResponseEntity<ApiResponse> listAll() {
        return ResponseEntity.ok().body(new ApiResponse("Cursos", courseService.getAllCourses()));
    }

    @GetMapping("/{id}/content-summary")
    public ResponseEntity<ApiResponse> getCourseContentSummary(@PathVariable @Valid Long id) {

        try {

            CourseContentSummaryDTO courseContentSummary = courseService.getCourseContentSummaryById(id);

            return ResponseEntity.ok().body(new ApiResponse("Resumo do conteúdo do curso", courseContentSummary));

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(new ApiResponse(e.getMessage(), null));
        }

    }

    @GetMapping("/by-classes")
    public ResponseEntity<ApiResponse> listAllByClassesId(@RequestParam List<Long> classIds) {
        return ResponseEntity.ok().body(new ApiResponse("Cursos", courseService.getAllCoursesByClasses(classIds)));
    }

}
