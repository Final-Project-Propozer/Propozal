package com.propozal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.propozal.domain.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByAdminUserId(Long adminUserId);

    @Query("SELECT c.id FROM Company c WHERE c.adminUserId = :adminUserId")
    Optional<Long> findCompanyIdByAdminUserId(@Param("adminUserId") Long adminUserId);
}
