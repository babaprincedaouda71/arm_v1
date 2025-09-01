package org.example.authservice.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.example.authservice.filter.JwtFilter;
import org.example.authservice.service.CustomUserDetailsService;
import org.example.authservice.token.TokenRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;
    private final TokenRepo tokenRepo;
    private final LogoutHandler logoutHandler;

    @Value("${security.endpoints.permitAll}")
    private String[] permitAllEndpoints;

    @Value("${security.endpoints.authenticatedCompany}")
    private String authenticatedCompanyEndpoint;

    @Value("${security.endpoints.logout}")
    private String logoutEndpoint;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService, JwtService jwtService, TokenRepo tokenRepo, LogoutHandler logoutHandler) {
        this.customUserDetailsService = customUserDetailsService;
        this.jwtService = jwtService;
        this.tokenRepo = tokenRepo;
        this.logoutHandler = logoutHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize ->
                        authorize.requestMatchers(
                                        permitAllEndpoints
                                ).permitAll()
                                // Exiger une authentification pour cet endpoint
                                .requestMatchers(authenticatedCompanyEndpoint).authenticated()
                                .anyRequest().authenticated()
                )
                // Filtre
                .addFilterBefore(new JwtFilter(customUserDetailsService, jwtService, tokenRepo), UsernamePasswordAuthenticationFilter.class)

                // logout
                .logout(logout -> logout
                        .logoutUrl(logoutEndpoint)
                        .addLogoutHandler(logoutHandler)
                        .logoutSuccessHandler(
                                (request, response, authentication) -> {
                                    SecurityContextHolder.clearContext();
                                    // Supprimer le cookie JWT côté client
                                    Cookie jwtCookie = new Cookie("jwt", null);
                                    jwtCookie.setHttpOnly(true);
                                    jwtCookie.setSecure(true); // Utilisez true si vous êtes en HTTPS
                                    jwtCookie.setPath("/");
                                    jwtCookie.setMaxAge(0); // Supprimer le cookie
                                    response.addCookie(jwtCookie);
                                    // Rediriger vers la page de connexion ou renvoyer une réponse JSON
                                    response.setStatus(HttpServletResponse.SC_OK);
                                    response.getWriter().write("Déconnexion réussie");
                                }
                        )
                )
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}