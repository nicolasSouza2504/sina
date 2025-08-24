package senai.com.ava_senai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    OpenAPI customOpemAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Documentação API AVA SENAI")
                        .version("v1")
                        .description("Documentação API AVA SENAI - Ambiente Virtual de Aprendizagem do SENAI")
                        .license(new License().name("Apache 2.0")));
    }

    @Bean
    GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .packagesToScan("senai.com.ava_senai.controller")
                .pathsToMatch("/api/**") // or "/api/v1/**"
                .build();
    }

}
