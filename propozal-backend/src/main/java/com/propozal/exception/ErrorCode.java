package com.propozal.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
public enum ErrorCode {

    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "C001", "카테고리를 찾을 수 없습니다."),
    CATEGORY_ALREADY_EXISTS(HttpStatus.CONFLICT, "C002", "이미 존재하는 카테고리입니다."),
    CATEGORY_HAS_CHILDREN(HttpStatus.CONFLICT, "C003", "하위 카테고리가 존재하여 삭제할 수 없습니다."),

    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "제품을 찾을 수 없습니다."),
    PRODUCT_ALREADY_EXISTS(HttpStatus.CONFLICT, "P002", "이미 존재하는 제품입니다."),

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    USER_PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "U002", "사용자 프로필을 찾을 수 없습니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "U003", "이미 사용 중인 이메일입니다."),

    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "A001", "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "A002", "접근 권한이 없습니다."),
    EMAIL_NOT_VERIFIED(HttpStatus.UNAUTHORIZED, "A003", "이메일 인증이 필요합니다."),
    ACCOUNT_PENDING_APPROVAL(HttpStatus.FORBIDDEN, "A004", "계정이 승인 대기 중입니다."),
    INVALID_TOKEN(HttpStatus.BAD_REQUEST, "A005", "유효하지 않은 토큰입니다."),
    TOKEN_ALREADY_USED(HttpStatus.BAD_REQUEST, "A006", "이미 사용된 토큰입니다."),
    TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "A007", "토큰이 만료되었습니다."),
    PASSWORD_POLICY_VIOLATION(HttpStatus.BAD_REQUEST, "A008", "비밀번호 정책을 위반했습니다."),

    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "S001", "서버 오류가 발생했습니다."),
    
    //고객 관련
    CUSTOMER_NOT_FOUND(HttpStatus.NOT_FOUND, "CU001", "고객 정보를 찾을 수 없습니다."), 
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "CU002", "유효하지 않은 고객 정보입니다."),;

    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
