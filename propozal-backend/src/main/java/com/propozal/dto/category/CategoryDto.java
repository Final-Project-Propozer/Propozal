package com.propozal.dto.category;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryDto {
    private Long idLv1;
    private Long idLv2;
    private Long idLv3;
    private String nameLv1;
    private String nameLv2;
    private String nameLv3;
}