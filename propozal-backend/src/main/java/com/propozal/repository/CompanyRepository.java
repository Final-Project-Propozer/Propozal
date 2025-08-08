package com.propozal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.propozal.domain.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByAdminUserId(Long adminUserId);
}
