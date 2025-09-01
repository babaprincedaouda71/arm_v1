package org.example.gatewayservice.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthenticationFilter implements GatewayFilter {
    @Value("${app.secret-key}")
    private String secretKey;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // Nous retirons la liste apiEndpoints et la vérification isApiSecured

        if (!request.getHeaders().containsKey("Authorization")) {
            /****************************************************/
            HttpCookie jwtCookie = request.getCookies().getFirst("token");
            if (jwtCookie != null) {
                String token = jwtCookie.getValue();
                ServerHttpRequest modifiedRequest = exchange.getRequest()
                        .mutate()
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .build();
                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            }
            /****************************************************/
            else {
                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return response.setComplete();
            }
        }
        final String token = request.getHeaders().getOrEmpty("Authorization").get(0);
        if (token != null && token.startsWith("Bearer ")) {
            try {
                String jwt = token.substring(7);
                SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();

                exchange.getRequest().mutate()
                        .header("X-Company-Id", String.valueOf(claims.get("companyId")))
                        .header("X-User-Id", String.valueOf(claims.get("userId")))
                        .header("X-User-Role", String.valueOf(claims.get("role")))
                        .build();
            } catch (Exception e) {
                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return response.setComplete();
            }
        } else {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }
        return chain.filter(exchange);
    }
}