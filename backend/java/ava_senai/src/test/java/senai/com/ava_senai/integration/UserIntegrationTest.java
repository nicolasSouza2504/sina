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
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.domain.user.UserLogin;
import senai.com.ava_senai.domain.user.UserRegisterDTO;
import senai.com.ava_senai.domain.user.UserResponseData;
import senai.com.ava_senai.response.ApiResponse;

import java.io.File;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class UserIntegrationTest {

	private static RequestSpecification specification;
	private static ObjectMapper mapper;
	private static String token;
	private UserRegisterDTO userRegisterDTO;
	private UserResponseData userResponseData;

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
		userRegisterDTO.setCpf("08969751939");
		userRegisterDTO.setRole(new Role("USER"));
		userRegisterDTO.setRoleId(3l);

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
	void testAddUser() throws Throwable {

		// Set other necessary fields
		String response = given()
				.spec(specification)
				.header("Authorization", "Bearer " + token)
				.contentType(ContentType.MULTIPART)
				.multiPart("user", mapper.writeValueAsString(userRegisterDTO))
				.multiPart("image", new File("src/test/resources/img/7.jpg"))
				.when()
				.post("/add/ADMIN")
				.then()
				.statusCode(200)
				.body("message", equalTo("Administrador Registrado com sucesso!")).extract().body().asString();

		ApiResponse apiResponse = new Gson().fromJson(response, ApiResponse.class);

		userResponseData = mapper.convertValue(apiResponse.getData(), UserResponseData.class);

	}


	@Test
	@Order(2)
	void testGetUserById() {
		given()
				.spec(specification)
				.header("Authorization", "Bearer " + token)
				.contentType(ContentType.JSON)
				.when()
				.get("/{id}", userResponseData.id())
				.then()
				.statusCode(200)
				.body("message", equalTo("Sucesso!"));
	}

	@Test
	@Order(3)
	void testUpdateUser() throws Throwable {

		userRegisterDTO.setName("Updated User");
		userRegisterDTO.setEmail("updateduser@example.com");
		userRegisterDTO.setPassword("newpassword123");

		// Set other necessary fields

		given()
				.spec(specification)
				.header("Authorization", "Bearer " + token)
				.contentType(ContentType.MULTIPART)
				.multiPart("user", mapper.writeValueAsString(userRegisterDTO))
				.multiPart("image", new File("src/test/resources/img/7.jpg"))
				.when()
				.put("/update/{userId}", userResponseData.id())
				.then()
				.statusCode(200)
				.body("message", equalTo("USER Editado com sucesso!"));
	}

	@Test
	@Order(4)
	void testListAllUsers() {
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
