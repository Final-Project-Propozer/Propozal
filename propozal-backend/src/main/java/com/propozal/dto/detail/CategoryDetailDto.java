package com.propozal.dto.detail;

import com.propozal.domain.Category;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CategoryDetailDto {
    private Long id;
    private String name;

    public CategoryDetailDto(Category category) {
        if (category != null) {
            this.id = category.getId();
            this.name = category.getName();
        }
    }
}