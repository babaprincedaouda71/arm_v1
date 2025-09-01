package org.example.companyservice.utils;

import org.example.companyservice.config.CustomAuthenticationToken;
import org.example.companyservice.exceptions.InvalidAuthenticationTokenException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static CustomAuthenticationToken getCustomAuthenticationToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof CustomAuthenticationToken)) {
            throw new InvalidAuthenticationTokenException("Invalid authentication token.", null);
        }
        return (CustomAuthenticationToken) authentication;
    }

    public static Long extractCompanyId(CustomAuthenticationToken authentication) {
        CustomAuthenticationToken customAuth = authentication;
        return customAuth.getCompanyId();
    }

    public static Long getCurrentCompanyId() {
        CustomAuthenticationToken authentication = getCustomAuthenticationToken();
        return extractCompanyId(authentication);
    }
}