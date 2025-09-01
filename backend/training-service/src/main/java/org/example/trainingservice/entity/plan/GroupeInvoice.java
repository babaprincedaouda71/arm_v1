package org.example.trainingservice.entity.plan;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.example.trainingservice.enums.GroupeInvoiceStatusEnums;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "Comptabilité du groupe")
public class GroupeInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "Identifiant")
    private UUID id;
    @Column(name = "Identifiant entreprise")
    private Long companyId;
    @Column(name = "Type de facture")
    private String type;
    @Column(name = "Date de création")
    private LocalDate creationDate;
    @Column(name = "Description")
    private String description;
    @Column(name = "Montant")
    private BigDecimal amount;
    @Column(name = "Statut")
    @Enumerated(EnumType.STRING)
    private GroupeInvoiceStatusEnums status;
    @Column(name = "Date de paiement")
    private LocalDate paymentDate;
    @Column(name = "Moyen de paiement")
    private String paymentMethod;
    @Column(name = "Facture")
    private String invoiceFile;
    @Column(name = "Remise de la banque")
    private String bankRemiseFile;
    @Column(name = "Reçu")
    private String receiptFile;

    // Relation Many-to-One avec TrainingGroupe
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "training_groupe_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_groupe_invoice_training_groupe"))
    @JsonBackReference
    @ToString.Exclude
    private TrainingGroupe trainingGroupe;
}