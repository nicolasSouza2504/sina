package senai.com.ava_senai.domain.course;

import senai.com.ava_senai.domain.course.section.Section;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;

import java.util.List;

public record CourseContentSummaryDTO(String name, Integer quantitySemester, Long id, List<SectionSummaryDTO> sections) {

    record SectionSummaryDTO(Long id, String name, Integer semester, Long courseId, List<KnowledgeTrailSummaryDTO> knowledgeTrails) {

        record KnowledgeTrailSummaryDTO(Long id, String name, List<TaskSummaryDTO> tasks) {

            public KnowledgeTrailSummaryDTO(KnowledgeTrail knowledgeTrail) {
                this(knowledgeTrail.getId(), knowledgeTrail.getName(),
                        knowledgeTrail.getTasks() != null ? knowledgeTrail.getTasks().stream()
                                .map(task -> new TaskSummaryDTO(task))
                                .toList() : List.of());
            }

            record TaskSummaryDTO(Long id, String name, String description, Integer taskOrder, List<TaskContentSummaryDTO> contents) {

                public TaskSummaryDTO(Task task) {

                    this(task.getId(), task.getName(), task.getDescription(), task.getTaskOrder(),
                            task.getContents() != null ? task.getContents().stream()
                                    .map(content -> new TaskContentSummaryDTO(content))
                                    .toList() : List.of());

                }

                record TaskContentSummaryDTO(Long id, String contentType, String contentUrl) {

                    public TaskContentSummaryDTO(TaskContent taskContent) {
                        this(taskContent.getId(), taskContent.getContentType().toString(), taskContent.getContentUrl());
                    }

                }

            }

        }

        public SectionSummaryDTO(Section section) {
            this(section.getId(), section.getName(), section.getSemester(), section.getCourseId(),
                    section.getKnowledgeTrails() != null
                    ? section.getKnowledgeTrails().stream()
                    .map(KnowledgeTrailSummaryDTO::new)
                    .toList()
                    : null);
        }

    }

    public CourseContentSummaryDTO(Course course) {
        this(course.getName(), course.getQuantitySemester(), course.getId(),
                course.getSections() != null
                        ? course.getSections().stream()
                        .map(SectionSummaryDTO::new)
                        .toList()
                        : List.of());
    }

}
