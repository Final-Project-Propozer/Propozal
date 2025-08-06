package com.propozal.dto.category;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryCreateRequestDto {
    private String name;
    private String level;
    private Long parentId;
}
