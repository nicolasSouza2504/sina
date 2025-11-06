package senai.com.ava_senai.domain.user;

import senai.com.ava_senai.domain.course.section.Section;
import senai.com.ava_senai.domain.task.Task;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.taskuser.TaskUser;

import java.util.*;

public record UserContentSummaryDTO(
        Long id,
        String name,
        String email,
        List<SectionSummaryDTO> sections
) {
    record SectionSummaryDTO(
            Long id,
            String name,
            Integer semester,
            List<KnowledgeTrailSummaryDTO> knowledgeTrails
    ) {}

    record KnowledgeTrailSummaryDTO(
            Long id,
            String name,
            Boolean ranked,
            List<TaskSummaryDTO> tasks
    ) {}

    record TaskSummaryDTO(
            Long id,
            String name,
            String description,
            Integer taskOrder,
            Date dueDate,
            List<TaskContentSummaryDTO> contents
    ) {}

    record TaskContentSummaryDTO(
            Long id,
            String contentType,
            String contentUrl,
            String name
    ) {}

    public UserContentSummaryDTO(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                organizeTasks(user.getTaskUsers())
        );
    }

    private static List<SectionSummaryDTO> organizeTasks(List<TaskUser> taskUsers) {
        if (taskUsers == null) return List.of();

        // Group by section
        Map<Long, Map<String, Object>> sections = new HashMap<>();

        for (TaskUser taskUser : taskUsers) {
            Task task = taskUser.getTask();
            KnowledgeTrail kt = task.getKnowledgeTrail();
            Section section = kt.getSection();

            // Get or create section data
            Map<String, Object> sectionData = sections.computeIfAbsent(section.getId(), id -> new HashMap<>(Map.of(
                    "id", section.getId(),
                    "name", section.getName(),
                    "semester", section.getSemester(),
                    "trails", new HashMap<Long, Map<String, Object>>()
            )));

            // Get or create knowledge trail data
            Map<Long, Map<String, Object>> trails = (Map<Long, Map<String, Object>>) sectionData.get("trails");
            Map<String, Object> trailData = trails.computeIfAbsent(kt.getId(), id -> new HashMap<>(Map.of(
                    "id", kt.getId(),
                    "name", kt.getName(),
                    "ranked", kt.getRanked(),
                    "tasks", new ArrayList<TaskSummaryDTO>()
            )));

            // Add task
            List<TaskSummaryDTO> trailTasks = (List<TaskSummaryDTO>) trailData.get("tasks");
            trailTasks.add(new TaskSummaryDTO(
                    task.getId(),
                    task.getName(),
                    task.getDescription(),
                    task.getTaskOrder(),
                    task.getDueDate(),
                    task.getContents().stream()
                            .map(content -> new TaskContentSummaryDTO(
                                    content.getId(),
                                    content.getContentType().toString(),
                                    content.getContentUrl(),
                                    content.getName()
                            ))
                            .toList()
            ));
        }

        // Convert to DTOs
        return sections.values().stream()
                .map(sectionData -> new SectionSummaryDTO(
                        (Long) sectionData.get("id"),
                        (String) sectionData.get("name"),
                        (Integer) sectionData.get("semester"),
                        ((Map<Long, Map<String, Object>>) sectionData.get("trails")).values().stream()
                                .map(trailData -> new KnowledgeTrailSummaryDTO(
                                        (Long) trailData.get("id"),
                                        (String) trailData.get("name"),
                                        (Boolean) trailData.get("ranked"),
                                        (List<TaskSummaryDTO>) trailData.get("tasks")
                                ))
                                .sorted(Comparator.comparing(KnowledgeTrailSummaryDTO::name))
                                .toList()
                ))
                .sorted(Comparator.comparing(SectionSummaryDTO::semester))
                .toList();
    }
}
