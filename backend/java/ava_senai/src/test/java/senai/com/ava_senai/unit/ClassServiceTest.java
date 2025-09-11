package senai.com.ava_senai.unit;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import senai.com.ava_senai.domain.clazz.Class;
import senai.com.ava_senai.domain.clazz.ClassRegisterDTO;
import senai.com.ava_senai.domain.clazz.ClassResponseDTO;
import senai.com.ava_senai.exception.AlreadyExistsException;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.repository.TurmaRepository;
import senai.com.ava_senai.services.clazz.ClassService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClassServiceTest {

    @Mock
    private TurmaRepository turmaRepository;

    @InjectMocks
    private ClassService classService;

    private ClassRegisterDTO classRegisterDTO;
    private Class clazz;

    @BeforeEach
    void setUp() {
        classRegisterDTO = new ClassRegisterDTO("Test Class", LocalDate.of(2023, 1, 1), LocalDate.of(2023, 12, 31), "class_image.jpg");
        clazz = new Class();
        clazz.setId(1L);
        clazz.setName("Test Class");
        clazz.setStartDate(LocalDate.of(2023, 1, 1));
        clazz.setFinalDate(LocalDate.of(2023, 12, 31));
        clazz.setImgClass("class_image.jpg");
    }

    @Test
    @DisplayName("Given a ClassRegisterDTO when createClass then return ClassResponseDTO")
    void givenClassRegisterDTOWhenCreateClassThenReturnClassResponseDTO() {
        when(turmaRepository.existsByName(classRegisterDTO.name())).thenReturn(false);
        when(turmaRepository.save(any(Class.class))).thenReturn(clazz);

        ClassResponseDTO response = classService.createClass(classRegisterDTO);

        assertNotNull(response);
        assertEquals(clazz.getId(), response.Id());
        assertEquals(clazz.getName(), response.nome());
    }

    @Test
    @DisplayName("Given an existing class name when createClass then throw AlreadyExistsException")
    void givenExistingClassNameWhenCreateClassThenThrowAlreadyExistsException() {
        when(turmaRepository.existsByName(classRegisterDTO.name())).thenReturn(true);

        Exception exception = assertThrows(AlreadyExistsException.class, () -> classService.createClass(classRegisterDTO));

        assertEquals("Turma ja Existente", exception.getMessage());
    }

    @Test
    @DisplayName("Given classes exist when getTurmas then return list of ClassResponseDTO")
    void givenClassesExistWhenGetTurmasThenReturnListOfClassResponseDTO() {
        when(turmaRepository.findAll()).thenReturn(List.of(clazz));

        List<ClassResponseDTO> classes = classService.getTurmas();

        assertNotNull(classes);
        assertEquals(1, classes.size());
        assertEquals(clazz.getId(), classes.get(0).Id());
    }

    @Test
    @DisplayName("Given no classes exist when getTurmas then throw NullListException")
    void givenNoClassesExistWhenGetTurmasThenThrowNullListException() {
        when(turmaRepository.findAll()).thenReturn(List.of());

        Exception exception = assertThrows(NullListException.class, () -> classService.getTurmas());

        assertEquals("Lista de Turmas esta Vazia!", exception.getMessage());
    }

    @Test
    @DisplayName("Given a valid class ID when getTurmaById then return ClassResponseDTO")
    void givenValidClassIdWhenGetTurmaByIdThenReturnClassResponseDTO() {
        when(turmaRepository.existsById(1L)).thenReturn(true);
        when(turmaRepository.getReferenceById(1L)).thenReturn(clazz);

        ClassResponseDTO response = classService.getTurmaById(1L);

        assertNotNull(response);
        assertEquals(clazz.getId(), response.Id());
        assertEquals(clazz.getName(), response.nome());
    }

    @Test
    @DisplayName("Given an invalid class ID when getTurmaById then throw NotFoundException")
    void givenInvalidClassIdWhenGetTurmaByIdThenThrowNotFoundException() {
        when(turmaRepository.existsById(1L)).thenReturn(false);

        Exception exception = assertThrows(NotFoundException.class, () -> classService.getTurmaById(1L));

        assertEquals("Turma não econtrada pelo id:1!", exception.getMessage());
    }

    @Test
    @DisplayName("Given a valid class ID when updateClass then return ClassResponseDTO")
    void givenValidClassIdWhenUpdateClassThenReturnClassResponseDTO() {
        when(turmaRepository.findById(1L)).thenReturn(Optional.of(clazz));
        when(turmaRepository.existsByNameLikeAndIdNot(classRegisterDTO.name(), 1L)).thenReturn(false);
        when(turmaRepository.save(any(Class.class))).thenReturn(clazz);

        ClassResponseDTO response = classService.updateClass(classRegisterDTO, 1L);

        assertNotNull(response);
        assertEquals(clazz.getId(), response.Id());
        assertEquals(clazz.getName(), response.nome());
    }

    @Test
    @DisplayName("Given an invalid class ID when updateClass then throw NotFoundException")
    void givenInvalidClassIdWhenUpdateClassThenThrowNotFoundException() {
        when(turmaRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(NotFoundException.class, () -> classService.updateClass(classRegisterDTO, 1L));

        assertEquals("Turma para edição não encontrada!", exception.getMessage());
    }

    @Test
    @DisplayName("Given a class name that already exists when updateClass then throw AlreadyExistsException")
    void givenClassNameAlreadyExistsWhenUpdateClassThenThrowAlreadyExistsException() {
        when(turmaRepository.findById(1L)).thenReturn(Optional.of(clazz));
        when(turmaRepository.existsByNameLikeAndIdNot(classRegisterDTO.name(), 1L)).thenReturn(true);

        Exception exception = assertThrows(AlreadyExistsException.class, () -> classService.updateClass(classRegisterDTO, 1L));

        assertEquals("Turma com esse Nome já existe", exception.getMessage());
    }

    @Test
    @DisplayName("Given a valid class ID when deleteTurma then delete the class")
    void givenValidClassIdWhenDeleteTurmaThenDeleteTheClass() {
        when(turmaRepository.findById(1L)).thenReturn(Optional.of(clazz));

        assertDoesNotThrow(() -> classService.deleteTurma(1L));
    }

    @Test
    @DisplayName("Given an invalid class ID when deleteTurma then throw NotFoundException")
    void givenInvalidClassIdWhenDeleteTurmaThenThrowNotFoundException() {
        when(turmaRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(NotFoundException.class, () -> classService.deleteTurma(1L));

        assertEquals("Turma para deletar não encontrada", exception.getMessage());
    }
}
