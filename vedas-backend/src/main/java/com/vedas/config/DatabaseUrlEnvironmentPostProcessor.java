package com.vedas.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Normalizes Render/Heroku style postgres:// or postgresql:// connection strings
 * into jdbc:postgresql:// URLs before Spring Boot initializes the DataSource.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String raw = environment.getProperty("SPRING_DATASOURCE_URL");
        if (raw == null || raw.isBlank()) {
            raw = environment.getProperty("DATABASE_URL");
        }
        if (raw == null || raw.isBlank()) {
            raw = environment.getProperty("spring.datasource.url");
        }
        if (raw == null || raw.isBlank() || raw.startsWith("jdbc:")) {
            return;
        }
        if (raw.startsWith("postgres://") || raw.startsWith("postgresql://")) {
            try {
                URI uri = URI.create(raw.replaceFirst("^postgres://", "postgresql://"));
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath() != null ? uri.getPath() : "/all_service_db";
                String query = uri.getQuery() != null && !uri.getQuery().isBlank() ? "?" + uri.getQuery() : "";
                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + query;

                Map<String, Object> overrides = new LinkedHashMap<>();
                overrides.put("spring.datasource.url", jdbcUrl);

                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    String envUser = environment.getProperty("SPRING_DATASOURCE_USERNAME");
                    if (envUser == null || envUser.isBlank()) {
                        overrides.put("spring.datasource.username", parts[0]);
                    }
                    String envPass = environment.getProperty("SPRING_DATASOURCE_PASSWORD");
                    if (envPass == null || envPass.isBlank()) {
                        overrides.put("spring.datasource.password", parts[1]);
                    }
                }
                environment.getPropertySources().addFirst(new MapPropertySource("renderPostgresUrl", overrides));
            } catch (Exception ignored) {
                // Fall back to configured properties
            }
        }
    }
}
