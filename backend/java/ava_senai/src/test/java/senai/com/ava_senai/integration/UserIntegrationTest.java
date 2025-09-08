package senai.com.ava_senai.integration;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.filter.log.LogDetail;
import io.restassured.filter.log.ResponseLoggingFilter;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import senai.com.ava_senai.config.TestConfig;
import senai.com.ava_senai.domain.Role.Role;
import senai.com.ava_senai.domain.user.UserLogin;
import senai.com.ava_senai.domain.user.UserRegisterDTO;
import senai.com.ava_senai.domain.user.UserResponseDTO;
import senai.com.ava_senai.response.ApiResponse;

import java.io.File;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class UserIntegrationTest {

	private static RequestSpecification specification;
	private static ObjectMapper mapper;
	private static String token;
	private UserRegisterDTO userRegisterDTO;
	private UserResponseDTO userResponseData;

	@BeforeAll
	public void setup() {

		mapper = new ObjectMapper();
		mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

		specification = new RequestSpecBuilder()
				.setBasePath("/api/v1/user")
				.setPort(TestConfig.SERVER_PORT)
				.addFilter(new ResponseLoggingFilter(LogDetail.BODY))
				.build();

		// Perform login and retrieve token
		loginAndRetrieveToken();

		UserRegisterDTO userRegisterDTO = new UserRegisterDTO();
		userRegisterDTO.setName("Test User");
		userRegisterDTO.setEmail("testuser@example.com");
		userRegisterDTO.setPassword("password123");
		userRegisterDTO.setCpf("95566310036");
		userRegisterDTO.setRole(new Role("USER"));
		userRegisterDTO.setRoleId(3L);

		this.userRegisterDTO = userRegisterDTO;

	}

	private void loginAndRetrieveToken() {

		UserLogin loginRequest = new UserLogin("admin@gmail.com", "admin@65468*/62.98+/*52989856*//*/");

		token = given()
				.contentType(ContentType.JSON)
				.body(loginRequest)
				.when()
				.post("/api/v1/auth/login")
				.then()
				.statusCode(200)
				.extract()
				.path("data.token");

	}

	@Test
	@Order(1)
	@DisplayName("Integration test given a UserRegister when add should return a user response data with right properties")
	void integrationTestGivenUserRegisterWhenAddShouldReturnUserResponseData() throws Throwable {

		String response = given()
				.spec(specification)
				.header("Authorization", "Bearer " + token)
				.contentType(ContentType.MULTIPART)
				.multiPart("user", mapper.writeValueAsString(userRegisterDTO))
				.multiPart("image", new File("src/test/resources/img/7.jpg"))
				.when()
				.post("/add/USER")
				.then()
				.statusCode(200)
				.body("message", equalTo("Usuário Registrado com sucesso!"))
				.extract()
				.asString();

		ApiResponse apiResponse = new Gson().fromJson(response, ApiResponse.class);

		userResponseData = mapper.convertValue(apiResponse.getData(), UserResponseDTO.class);

		assertNotNull(userResponseData);
		assertNotNull(userResponseData.id());
		assertEquals(userRegisterDTO.getName(), userResponseData.nome());
		assertEquals(userRegisterDTO.getEmail(), userResponseData.email());
		assertTrue(userResponseData.roles().contains("USER"));

	}


	@Test
	@Order(2)
	@DisplayName("Integration test given ID registered user when call get should return registered user")
	void integrationTestGivenIDRegisteredUserWhenCallGetShouldReturnRegisteredUser() {

		String response = given()
				.spec(specification)
				.header("Authorization", "Bearer " + token)
				.contentType(ContentType.JSON)
				.when()
				.get("/{id}", userResponseData.id())
				.then()
				.statusCode(200)
				.body("message", equalTo("Sucesso!"))
				.extract()
				.asString();

		ApiResponse apiResponse = new Gson().fromJson(response, ApiResponse.class);

		userResponseData = mapper.convertValue(apiResponse.getData(), UserResponseDTO.class);

		assertNotNull(userResponseData);
		assertNotNull(userResponseData.id());
		assertEquals(userRegisterDTO.getName(), userResponseData.nome());
		assertEquals(userRegisterDTO.getEmail(), userResponseData.email());
		assertTrue(userResponseData.roles().contains("USER"));

	}

	@Test
	@Order(3)
	@DisplayName("Integration test given a UserRegister when update should return a user response data with right properties")
	void integrationTestGivenUserRegisterWhenUpdateShouldReturnUserResponseData() throws Throwable {

		userRegisterDTO.setName("Updated User");
		userRegisterDTO.setEmail("updateduser@example.com");
		userRegisterDTO.setPassword("newpassword123");

		String response = given()
				.spec(specification)
				.header("Authorization", "Bearer " + token)
				.contentType(ContentType.MULTIPART)
				.multiPart("user", mapper.writeValueAsString(userRegisterDTO))
				.multiPart("image", new File("src/test/resources/img/7.jpg"))
				.when()
				.put("/update/{userId}", userResponseData.id())
				.then()
				.statusCode(200)
				.body("message", equalTo("USER Editado com sucesso!"))
				.extract()
				.asString();

		ApiResponse apiResponse = new Gson().fromJson(response, ApiResponse.class);

		userResponseData = mapper.convertValue(apiResponse.getData(), UserResponseDTO.class);

		assertNotNull(userResponseData);
		assertNotNull(userResponseData.id());
		assertEquals(userRegisterDTO.getName(), userResponseData.nome());
		assertEquals(userRegisterDTO.getEmail(), userResponseData.email());
		assertTrue(userResponseData.roles().contains("USER"));

	}

	@Test
	@Order(4)
	@DisplayName("Integration test given a request when call list all users should return a list of users")
	void integrationTestGivenRequestWhenCallListAllShouldReturnAListOfUsers() {
		given()
				.spec(specification)
				.header("Authorization", "Bearer " + token)
				.contentType(ContentType.JSON)
				.when()
				.get("/list-all")
				.then()
				.statusCode(200)
				.body("message", equalTo("Usuários"));
	}
}
