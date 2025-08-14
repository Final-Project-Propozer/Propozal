package com.propozal.dto.user;

import com.propozal.domain.User;
import lombok.Builder;
import lombok.Getter;

//@Getter
//@Builder
//public class UserInfoResponse {
//    private Long id;
//    private String email;
//    private String name;
//    private String role;
//
//    public static UserInfoResponse from(User user) {
//        return UserInfoResponse.builder()
//                .id(user.getId())
//                .email(user.getEmail())
//                .name(user.getName())
//                .role(user.getRole().name())
//                .build();
//    }
//}

@Getter
@Builder
public class UserInfoResponse {
    private Long id;
    private String email;
    private String name;
    private String role;
    // 두 줄 추가
    private boolean isVerified;
    private boolean isActive;

    public static UserInfoResponse from(User user) {
        return UserInfoResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                // 두 줄 추가
                .isVerified(user.isVerified())
                .isActive(user.isActive())
                .build();
    }
}
