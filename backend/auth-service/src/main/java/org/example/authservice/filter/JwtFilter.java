package org.example.authservice.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.example.authservice.config.CustomAuthenticationToken;
import org.example.authservice.config.JwtService;
import org.example.authservice.service.CustomUserDetailsService;
import org.example.authservice.token.TokenRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;
    private final TokenRepo tokenRepo;

    public JwtFilter(CustomUserDetailsService customUserDetailsService, JwtService jwtService, TokenRepo tokenRepo) {
        this.customUserDetailsService = customUserDetailsService;
        this.jwtService = jwtService;
        this.tokenRepo = tokenRepo;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
            username = jwtService.extractUsername(jwtToken);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            Boolean isValidToken = tokenRepo.findByToken(jwtToken)
                    .map(token -> !token.isExpired() && !token.isRevoked())
                    .orElse(false);
            if (jwtService.validateToken(jwtToken, userDetails) && isValidToken) {
                Long companyId = jwtService.extractCompanyId(jwtToken); // Récupérer companyId du token
                CustomAuthenticationToken authentication = new CustomAuthenticationToken(userDetails, null, userDetails.getAuthorities(), companyId); // Créer CustomAuthenticationToken
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}