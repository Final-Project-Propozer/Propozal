package com.propozal.service;

import com.propozal.domain.EmployeeProfile;
import com.propozal.domain.EmployeeProfile.ApprovalStatus;
import com.propozal.dto.approval.PendingApprovalListResponseDto;
import com.propozal.dto.approval.PendingApprovalUserDto;
import com.propozal.exception.CustomException;
import com.propozal.exception.ErrorCode;
import com.propozal.repository.EmployeeProfileRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApprovalService {

    private final EmployeeProfileRepository employeeProfileRepository;

    // 승인 대기 목록 조회
    @Transactional
    public PendingApprovalListResponseDto getPendingApprovals(Long companyId) {
        List<EmployeeProfile> pendingProfiles =
                employeeProfileRepository.findByCompanyIdAndApprovalStatus(companyId, ApprovalStatus.PENDING);

        List<PendingApprovalUserDto> users = pendingProfiles.stream()
                .map(p -> new PendingApprovalUserDto(
                        p.getUser().getId(),
                        p.getUser().getName(),
                        p.getDepartment(),
                        p.getPosition()
                ))
                .toList();

        String companyName = pendingProfiles.isEmpty() ? null : pendingProfiles.get(0).getCompany().getCompanyName();

        return new PendingApprovalListResponseDto(companyId, companyName, users);
    }

    // 승인 처리
    @Transactional
    public void approveUser(Long userId) {
        EmployeeProfile profile = employeeProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_PROFILE_NOT_FOUND));
        profile.setApprovalStatus(ApprovalStatus.APPROVED);
        employeeProfileRepository.save(profile);
    }

    // 거부 처리
    @Transactional
    public void rejectUser(Long userId) {
        EmployeeProfile profile = employeeProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_PROFILE_NOT_FOUND));
        profile.setApprovalStatus(ApprovalStatus.REJECTED);
        employeeProfileRepository.save(profile);
    }
}
