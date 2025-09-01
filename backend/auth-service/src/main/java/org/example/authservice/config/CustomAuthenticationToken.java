package org.example.authservice.config;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {
    private final Long companyId;

    public CustomAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities, Long companyId) {
        super(principal, credentials, authorities);
        this.companyId = companyId;
    }

    public Long getCompanyId() {
        return companyId;
    }
}