package org.example.companyservice.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class TokenService {
    private final Map<String, String> tokenStorage = new HashMap<>();

    public String generateToken(Long companyId, String email) {
        String token = UUID.randomUUID().toString();
        String tokenData = email + ":" + companyId; // Concaténation de l'email et du companyId
        tokenStorage.put(token, tokenData);
        return token;
    }

    public String getEmailFromToken(String token) {
        String tokenData = tokenStorage.get(token);
        if (tokenData != null) {
            return tokenData.split(":")[0]; // Récupère l'email
        }
        return null;
    }

    public Long getCompanyIdFromToken(String token) {
        String tokenData = tokenStorage.get(token);
        if (tokenData != null) {
            return Long.parseLong(tokenData.split(":")[1]); // Récupère le companyId
        }
        return null;
    }
}