package com.propozal.service;

public class ActivityLogMaskingUtil {

    // 간단한 이메일 마스킹: user@example.com -> u***@example.com
    public static String maskEmail(String input) {
        if (input == null) return null;
        return input.replaceAll("([a-zA-Z0-9_.\\-])([a-zA-Z0-9_.\\-]*)@", "$1***@");
    }

    // 간단한 전화번호 마스킹: 010-1234-5678 -> 010-****-5678, 01012345678 -> 010****5678
    public static String maskPhone(String input) {
        if (input == null) return null;
        return input
                .replaceAll("(01[016789])[ -]?(\\d{3,4})[ -]?(\\d{4})", "$1-****-$3")
                .replaceAll("(\\d{2,3})-(\\d{3,4})-(\\d{4})", "$1-****-$3");
    }

    public static String mask(String message) {
        String masked = maskEmail(message);
        masked = maskPhone(masked);
        return masked;
    }
}
