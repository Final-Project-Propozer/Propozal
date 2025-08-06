package com.propozal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.propozal.domain.Estimate;
import com.propozal.dto.category.CategoryCreateRequestDto;
import com.propozal.dto.category.CategoryResponseDto;
import com.propozal.dto.category.CategoryUpdateRequestDto;
import com.propozal.service.CategoryAdminService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
public class CategoryAdminController {

    private final CategoryAdminService categoryService;

    @PostMapping("/insert")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponseDto> createCategory(@RequestBody CategoryCreateRequestDto request) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CategoryResponseDto>> getCategories() {
        return ResponseEntity.ok(categoryService.getCategories());
    }

    @PatchMapping("/{id}/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponseDto> updateCategory(@PathVariable("id") Long id,
            @RequestBody CategoryUpdateRequestDto request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @Transactional(readOnly = true) // 조회 기능이므로 readOnly=true 속성으로 성능 최적화
    public Estimate findEstimateById(Long estimateId) {
        return estimateRepository.findById(estimateId)
                .orElseThrow(() -> new EntityNotFoundException("해당 견적서를 찾을 수 없습니다. ID: " + estimateId));
    }
}
