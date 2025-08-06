package com.propozal.dto.category;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryResponseDto {
    private Long id;
    private String name;
    private String type;
    private Long parentId;
}
