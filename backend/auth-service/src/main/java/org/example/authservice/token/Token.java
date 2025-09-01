package org.example.authservice.token;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.authservice.entity.User;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Token {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;
    private String type;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private boolean expired;
    private boolean revoked;
}