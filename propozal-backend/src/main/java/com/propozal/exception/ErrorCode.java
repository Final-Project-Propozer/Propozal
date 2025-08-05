package com.propozal.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // 카테고리 관련
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "C001", "카테고리를 찾을 수 없습니다."),
    CATEGORY_ALREADY_EXISTS(HttpStatus.CONFLICT, "C002", "이미 존재하는 카테고리입니다."),
    CATEGORY_HAS_CHILDREN(HttpStatus.CONFLICT, "C003", "하위 카테고리가 존재하여 삭제할 수 없습니다."),

    // 제품 관련
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "제품을 찾을 수 없습니다."),
    PRODUCT_ALREADY_EXISTS(HttpStatus.CONFLICT, "P002", "이미 존재하는 제품입니다."),

    // 회원 관련
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    USER_PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "U002", "사용자 프로필을 찾을 수 없습니다."),

    // 인증/인가
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "A001", "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "A002", "접근 권한이 없습니다."),

    // 서버 오류
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "S001", "서버 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
