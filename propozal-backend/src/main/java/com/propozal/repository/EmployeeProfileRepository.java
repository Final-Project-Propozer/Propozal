package com.propozal.repository;

import com.propozal.domain.EmployeeProfile;
import com.propozal.domain.EmployeeProfile.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeProfileRepository extends JpaRepository<EmployeeProfile, Long> {
    Optional<EmployeeProfile> findByUserId(Long userId);
    List<EmployeeProfile> findByCompanyId(Long companyId);
    List<EmployeeProfile> findByCompanyIdAndApprovalStatus(Long companyId, ApprovalStatus status);
}
