package com.maisonverde.shop.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI maisonVerdeApi() {
        return new OpenAPI().info(new Info()
                .title("Maison Verde Shop API")
                .version("v1")
                .description("REST API for the Maison Verde e-commerce front-end"));
    }
}
