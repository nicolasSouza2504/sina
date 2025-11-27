package senai.com.ava_senai.integration;


import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.gson.Gson;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.filter.log.LogDetail;
import io.restassured.filter.log.ResponseLoggingFilter;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import senai.com.ava_senai.config.TestConfig;
import senai.com.ava_senai.domain.course.clazz.ClassRegisterDTO;
import senai.com.ava_senai.domain.course.clazz.ClassResponseDTO;
import senai.com.ava_senai.domain.user.UserLogin;
import senai.com.ava_senai.response.ApiResponse;

import java.time.LocalDate;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class ClassIntegrationTest {

    private static RequestSpecification specification;
    private static ObjectMapper mapper;
    private static String token;
    private ClassRegisterDTO classRegisterDTO;
    private ClassResponseDTO classResponseDTO;

    @BeforeAll
    public void setup() {
        mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

        mapper.registerModule(new JavaTimeModule());

        specification = new RequestSpecBuilder()
                .setBasePath("/api/class")
                .setPort(TestConfig.SERVER_PORT)
                .addFilter(new ResponseLoggingFilter(LogDetail.BODY))
                .build();

        // Perform login and retrieve token
        loginAndRetrieveToken();

        classRegisterDTO = new ClassRegisterDTO("Test Class", 1L,  LocalDate.of(2023, 1, 1), LocalDate.of(2023, 12, 31), "class_image.jpg", "cide", 1, List.of());
    }

    private void loginAndRetrieveToken() {
        UserLogin loginRequest = new UserLogin("admin@gmail.com", "admin");

        token = given()
                .contentType(ContentType.JSON)
                .body(loginRequest)
                .when()
                .post("/api/auth/login")
                .then()
                .statusCode(200)
                .extract()
                .path("data.token");
    }

    @Test
    @Order(1)
    @DisplayName("Integration test given a ClassRegister when add should return a class response data with right properties")
    void integrationTestGivenClassRegisterWhenAddShouldReturnClassResponseData() throws Throwable {
        String response = given()
                .spec(specification)
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(classRegisterDTO)
                .when()
                .post("/add")
                .then()
                .statusCode(200)
                .body("message", equalTo("Turma adicionada Com sucesso!"))
                .extract()
                .asString();

        ApiResponse apiResponse = new Gson().fromJson(response, ApiResponse.class);
        classResponseDTO = mapper.convertValue(apiResponse.getData(), ClassResponseDTO.class);

        assertNotNull(classResponseDTO);
        assertNotNull(classResponseDTO.Id());
        assertEquals(classRegisterDTO.name(), classResponseDTO.nome());
    }

    @Test
    @Order(2)
    @DisplayName("Integration test given ID registered class when call get should return registered class")
    void integrationTestGivenIDRegisteredClassWhenCallGetShouldReturnRegisteredClass() {
        String response = given()
                .spec(specification)
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .when()
                .get("/{classId}/class", classResponseDTO.Id())
                .then()
                .statusCode(200)
                .body("message", equalTo("Sucesso"))
                .extract()
                .asString();

        ApiResponse apiResponse = new Gson().fromJson(response, ApiResponse.class);
        ClassResponseDTO retrievedClass = mapper.convertValue(apiResponse.getData(), ClassResponseDTO.class);

        assertNotNull(retrievedClass);
        assertEquals(classResponseDTO.Id(), retrievedClass.Id());
        assertEquals(classResponseDTO.nome(), retrievedClass.nome());
    }

    @Test
    @Order(3)
    @DisplayName("Integration test given a ClassRegister when update should return a class response data with right properties")
    void integrationTestGivenClassRegisterWhenUpdateShouldReturnClassResponseData() throws Throwable {
        classRegisterDTO = new ClassRegisterDTO("Updated Class",1L, LocalDate.of(2023, 1, 1), LocalDate.of(2023, 12, 31), "updated_image.jpg", "codeup", 2, List.of());

        String response = given()
                .spec(specification)
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(classRegisterDTO)
                .when()
                .put("/{classId}/edit", classResponseDTO.Id())
                .then()
                .statusCode(200)
                .body("message", equalTo("Turma editado com sucesso!"))
                .extract()
                .asString();

        ApiResponse apiResponse = new Gson().fromJson(response, ApiResponse.class);
        classResponseDTO = mapper.convertValue(apiResponse.getData(), ClassResponseDTO.class);

        assertNotNull(classResponseDTO);
        assertEquals("Updated Class", classResponseDTO.nome());
    }

    @Test
    @Order(4)
    @DisplayName("Integration test given a request when call get all classes should return a list of classes")
    void integrationTestGivenRequestWhenCallGetAllShouldReturnAListOfClasses() {
        given()
                .spec(specification)
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .when()
                .get("/all")
                .then()
                .statusCode(200)
                .body("message", equalTo("Sucesso"));
    }

    @Test
    @Order(5)
    @DisplayName("Integration test given a class ID when delete should return success message")
    void integrationTestGivenClassIdWhenDeleteShouldReturnSuccessMessage() {
        given()
                .spec(specification)
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .when()
                .delete("/delete/{classId}", classResponseDTO.Id())
                .then()
                .statusCode(200)
                .body("message", equalTo("Turma deletada com sucesso!"));
    }

}
