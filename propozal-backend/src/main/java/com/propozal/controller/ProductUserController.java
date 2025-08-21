package com.propozal.controller;

import com.propozal.domain.User;
import com.propozal.dto.product.ProductUserResponseDto;
import com.propozal.jwt.CustomUserDetails;
import com.propozal.service.ProductUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductUserController {

    private final ProductUserService productUserService;

    @GetMapping
    public ResponseEntity<Page<ProductUserResponseDto>> getProducts(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        User user = userDetails.getUser();
        Page<ProductUserResponseDto> products = productUserService.getAllProducts(user, page, size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductUserResponseDto> getProductDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("id") long id
    ){
        User user = userDetails.getUser();
        ProductUserResponseDto productDetail = productUserService.getProductDetail(id, user);
        return ResponseEntity.ok(productDetail);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductUserResponseDto>> searchProducts(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryLv1Id,
            @RequestParam(required = false) Long categoryLv2Id,
            @RequestParam(required = false) Long categoryLv3Id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        User user = userDetails.getUser();
        Page<ProductUserResponseDto> filteredProducts = productUserService.getFilteredProducts(user, keyword, categoryLv1Id, categoryLv2Id, categoryLv3Id, page, size);
        return ResponseEntity.ok(filteredProducts);
    }
}
