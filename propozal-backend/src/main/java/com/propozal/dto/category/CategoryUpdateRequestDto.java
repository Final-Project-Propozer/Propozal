package com.propozal.dto.category;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryUpdateRequestDto {
    private String name;
    private String level;
    private Long parentId;
}
