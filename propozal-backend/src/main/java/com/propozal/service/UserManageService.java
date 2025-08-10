package com.propozal.service;

import com.propozal.domain.EmailVerification;
import com.propozal.domain.EmployeeProfile;
import com.propozal.domain.User;
import com.propozal.dto.user.UserDetailResponseDto;
import com.propozal.dto.user.UserListResponseDto;
import com.propozal.dto.user.UserUpdateRequestDto;
import com.propozal.exception.CustomException;
import com.propozal.exception.ErrorCode;
import com.propozal.repository.EmailVerificationRepository;
import com.propozal.repository.EmployeeProfileRepository;
import com.propozal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserManageService {

    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final EmailVerificationRepository emailVerificationRepository;

    // 회사별 전체 회원 조회
    public List<UserListResponseDto> getUsersByCompany(Long companyId) {
        List<EmployeeProfile> profiles = employeeProfileRepository.findByCompanyId(companyId);
        return profiles.stream()
                .map(profile -> new UserListResponseDto(
                        profile.getUser().getId(),
                        profile.getUser().getName(),
                        profile.getDepartment(),
                        profile.getPosition()
                ))
                .toList();
    }

    // 회원 상세 조회
    public UserDetailResponseDto getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        EmployeeProfile profile = employeeProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_PROFILE_NOT_FOUND));

        return new UserDetailResponseDto(
                user.getId(),
                "********", // 비밀번호 마스킹
                user.getEmail(),
                user.getName(),
                profile.getDepartment(),
                profile.getPosition(),
                profile.getPhoneNumber(),
                profile.getEmployeeIdCardUrl()
        );
    }

    // 회원 정보 수정
    @Transactional
    public void updateUser(Long userId, UserUpdateRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        EmployeeProfile profile = employeeProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_PROFILE_NOT_FOUND));

        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPassword() != null) user.setPassword(request.getPassword());
        if (request.getName() != null) user.setName(request.getName());
        if (request.getDepartment() != null) profile.setDepartment(request.getDepartment());
        if (request.getPosition() != null) profile.setPosition(request.getPosition());
        if (request.getPhoneNumber() != null) profile.setPhoneNumber(request.getPhoneNumber());
        if (request.getEmployeeImageUrl() != null) profile.setEmployeeIdCardUrl(request.getEmployeeImageUrl());
    }

    // 회원 비활성화
    @Transactional
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.setActive(false);
    }

    // 이메일 인증 토큰 검증 및 사용자 isVerified 변경
    @Transactional
    public void verifyEmailToken(String token) {
        EmailVerification emailVerification = emailVerificationRepository.findByToken(token)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_TOKEN));

        if (emailVerification.isUsed()) {
            throw new CustomException(ErrorCode.TOKEN_ALREADY_USED);
        }

        emailVerification.setUsed(true);
        emailVerificationRepository.save(emailVerification);

        User user = userRepository.findById(emailVerification.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.setVerified(true);
        userRepository.save(user);
    }
}
