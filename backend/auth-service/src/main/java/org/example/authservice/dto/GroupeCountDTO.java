package org.example.authservice.dto;

import java.util.Set;

public interface GroupeCountDTO {
    Long getId();

    String getName();

    String getDescription();

    Long getCompanyId();

    Long getUserCount();

    Set<AccessRightDTO> getAccessRights();
}