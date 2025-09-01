package org.example.trainingservice.dto.ocf;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OCFUpdateDto {
    @NotBlank(message = "Le nom de l'entreprise ne peut pas être vide")
    private String corporateName;

    @NotBlank(message = "L'adresse ne peut pas être vide")
    private String address;

    @NotBlank(message = "Le téléphone ne peut pas être vide")
    @Pattern(regexp = "^[0-9]{10}$", message = "Le numéro de téléphone doit contenir 10 chiffres")
    private String phone;

    @NotBlank(message = "L'email ne peut pas être vide")
    @Email(message = "L'email doit être valide")
    private String email;

    private String website;
    private String staff;
    private LocalDate creationDate;
    private String legalForm;

    @NotBlank(message = "L'ICE ne peut pas être vide")
    private String ice;

    private String rc;
    private String patent;
    private String ifValue;
    private String cnss;
    private Integer permanentStaff;

    // Représentant légal
    @NotBlank(message = "Le nom du représentant légal ne peut pas être vide")
    private String nameLegalRepresentant;

    private String positionLegalRepresentant;
    private String phoneLegalRepresentant;

    @Email(message = "L'email du représentant légal doit être valide")
    private String emailLegalRepresentant;

    // Contact principal
    @NotBlank(message = "Le nom du contact principal ne peut pas être vide")
    private String nameMainContact;

    private String positionMainContact;
    private String phoneMainContact;

    @Email(message = "L'email du contact principal doit être valide")
    private String emailMainContact;
}