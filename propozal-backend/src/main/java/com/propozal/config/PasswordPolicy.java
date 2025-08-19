package com.propozal.config;

public final class PasswordPolicy {

    private PasswordPolicy() {}

    public static boolean isValid(String password, String email) {
        if (password == null || password.length() < 8) return false;

        int kinds = 0;
        if (password.matches(".*[a-z].*")) kinds++;
        if (password.matches(".*[A-Z].*")) kinds++;
        if (password.matches(".*\\d.*")) kinds++;
        if (password.matches(".*[^A-Za-z0-9].*")) kinds++;
        if (kinds < 2) return false;

        if (email != null) {
            String local = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
            if (!local.isBlank() && password.toLowerCase().contains(local.toLowerCase())) {
                return false;
            }
        }
        return true;
    }
}
