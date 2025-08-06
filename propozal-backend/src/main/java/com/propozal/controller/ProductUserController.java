package com.propozal.controller;

import com.propozal.domain.User;
import com.propozal.dto.product.ProductUserResponseDto;
import com.propozal.jwt.CustomUserDetails;
import com.propozal.service.ProductUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductUserController {

    private final ProductUserService productUserService;

    @GetMapping
    public Page<ProductUserResponseDto> getProducts(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
            ){
        User user = userDetails.getUser();
        return productUserService.getAllProducts(user, page, size);
    }

    @GetMapping("/{id}")
    public ProductUserResponseDto getProductDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable long id
    ){
        User user = userDetails.getUser();
        return productUserService.getProductDetail(id, user);
    }
}
