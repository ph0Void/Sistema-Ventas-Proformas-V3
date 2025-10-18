package com.TiendaVirtual.proyecto.security;

import com.TiendaVirtual.proyecto.security.jwt.IJwtProvider;
import com.TiendaVirtual.proyecto.security.jwt.JwtAuthorizationFilter;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
@AllArgsConstructor
public class ConfigSecurity {

    private final Logger logger = LoggerFactory.getLogger(ConfigSecurity.class);
    private final CustomUserDetailService customUserDetailService;
    private final IJwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    private static List<String> PUBLIC_PATHS = List.of(
            "/auth/login",
            "/auth/register",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/swagger-ui/**"
            );
            //"/product/**",
           // "/category/**"

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public JwtAuthorizationFilter jwtAuthorizationFilter() throws Exception {
        return new JwtAuthorizationFilter(jwtProvider, PUBLIC_PATHS);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        auth.userDetailsService(customUserDetailService).passwordEncoder(passwordEncoder);
        AuthenticationManager authenticationManager = auth.build();

        http.csrf(csrf -> csrf.disable())
                //.cors(cors -> cors.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authHttp -> {
                    authHttp.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll(); // Permite las opciones CORS

                    String[] publicPathsArray = PUBLIC_PATHS.toArray(new String[0]);
                    authHttp.requestMatchers(publicPathsArray).permitAll();

                    authHttp.anyRequest().authenticated();
                })
                .authenticationManager(authenticationManager);

        http.addFilterBefore(jwtAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
