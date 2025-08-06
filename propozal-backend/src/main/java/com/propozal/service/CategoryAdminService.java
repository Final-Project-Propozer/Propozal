package com.propozal.service;

import com.propozal.domain.Category;
import com.propozal.dto.category.CategoryCreateRequestDto;
import com.propozal.dto.category.CategoryResponseDto;
import com.propozal.dto.category.CategoryUpdateRequestDto;
import com.propozal.exception.CustomException;
import com.propozal.exception.ErrorCode;
import com.propozal.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryAdminService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryResponseDto createCategory(CategoryCreateRequestDto request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new CustomException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        Category parent = null;
        if (request.getParentId() != null) {
            parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));
        }

        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType())
                .parent(parent)
                .build();

        categoryRepository.save(category);

        return toResponse(category);
    }

    public List<CategoryResponseDto> getCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponseDto updateCategory(Long id, CategoryUpdateRequestDto request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        category.setName(request.getName());
        category.setType(request.getType());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return toResponse(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        boolean hasChildren = categoryRepository.findAll().stream()
                .anyMatch(c -> c.getParent() != null && c.getParent().getId().equals(id));
        if (hasChildren) {
            throw new CustomException(ErrorCode.CATEGORY_HAS_CHILDREN);
        }

        categoryRepository.delete(category);
    }

    private CategoryResponseDto toResponse(Category category) {
        CategoryResponseDto res = new CategoryResponseDto();
        res.setId(category.getId());
        res.setName(category.getName());
        res.setType(category.getType());
        res.setParentId(category.getParent() != null ? category.getParent().getId() : null);
        return res;
    }
}
