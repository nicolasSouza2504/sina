package senai.com.ava_senai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    OpenAPI customOpemAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("REST API With Spring Boot")
                        .version("v1")
                        .description("This is a sample of Spring Boot RESTful API with OpenAPI.")
                        .license(new License().name("Apache 2.0")));
    }

}
