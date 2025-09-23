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
import senai.com.ava_senai.domain.user.UserLogin;
import senai.com.ava_senai.response.ApiResponse;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class AuthControllerIntegrationTest {

    private static RequestSpecification specification;
    private static ObjectMapper mapper;
    private static String token;

    @BeforeAll
    public void setup() {
        mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.registerModule(new JavaTimeModule());

        specification = new RequestSpecBuilder()
                .setBasePath("/api/auth")
                .setPort(TestConfig.SERVER_PORT)
                .addFilter(new ResponseLoggingFilter(LogDetail.BODY))
                .build();
    }

    @Test
    @Order(1)
    @DisplayName("Integration test given valid credentials when login then return JWT token")
    void integrationTestGivenValidCredentialsWhenLoginThenReturnJwtToken() {
        UserLogin loginRequest = new UserLogin("admin@gmail.com", "admin");

        String response = given()
                .spec(specification)
                .contentType(ContentType.JSON)
                .body(loginRequest)
                .when()
                .post("/login")
                .then()
                .statusCode(200)
                .body("message", equalTo("Login Successful"))
                .extract()
                .asString();

        ApiResponse apiResponse = new Gson().fromJson(response, ApiResponse.class);
        token = apiResponse.getData().toString(); // Assuming the token is returned in the data field

        assertNotNull(token);
    }

    @Test
    @Order(2)
    @DisplayName("Integration test given invalid credentials when login then return unauthorized")
    void integrationTestGivenInvalidCredentialsWhenLoginThenReturnUnauthorized() {
        UserLogin loginRequest = new UserLogin("invalid@gmail.com", "wrongpassword");

        given()
                .spec(specification)
                .contentType(ContentType.JSON)
                .body(loginRequest)
                .when()
                .post("/login")
                .then()
                .statusCode(401)
                .body("message", equalTo("Bad credentials")); // Adjust based on your actual error message
    }
}
