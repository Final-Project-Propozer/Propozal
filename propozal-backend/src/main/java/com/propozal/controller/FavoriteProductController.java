package com.propozal.controller;

import com.propozal.domain.FavoriteProduct;
import com.propozal.domain.Product;
import com.propozal.domain.User;
import com.propozal.dto.product.AddFavoriteRequestDto;
import com.propozal.dto.product.ProductUserResponseDto;
import com.propozal.jwt.CustomUserDetails;
import com.propozal.service.FavoriteProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products/favorites")
@RequiredArgsConstructor
public class FavoriteProductController {

    private final FavoriteProductService favoriteProductService;

    @GetMapping
    public ResponseEntity<Page<ProductUserResponseDto>> getFavoriteProducts(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = userDetails.getUser();

        Page<ProductUserResponseDto> favorites = favoriteProductService.getFavoriteProductsByUser(user, page, size);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping
    public ResponseEntity<String> addFavoriteProduct(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody AddFavoriteRequestDto request) {

        User user = userDetails.getUser();
        favoriteProductService.addFavoriteProduct(user, request.getProductId());
        return ResponseEntity.ok("즐겨찾기에 추가되었습니다.");
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> removeFavoriteProduct(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("productId") Long productId) {

        User user = userDetails.getUser();
        favoriteProductService.removeFavoriteProduct(user, productId);
        return ResponseEntity.ok("즐겨찾기에서 제거되었습니다.");
    }


}
