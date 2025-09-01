package org.example.companyservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.companyservice.entity.Department;
import org.example.companyservice.enums.TrainingRoomEnum;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteWithDepartmentsDto {
    private Long id;
    private String code;
    private String label;
    private String address;
    private String city;
    private String phone;
    private TrainingRoomEnum trainingRoom;
    private int size;
    private List<Department> departments;
}