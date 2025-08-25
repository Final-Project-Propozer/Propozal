package com.propozal.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.propozal.domain.Company;

@Repository
public interface CompanyAdminRepository extends JpaRepository<Company, Long> {

    boolean existsByBusinessNumber(String businessNumber);

    boolean existsByBusinessNumberAndIdNot(String businessNumber, Long id);

    @Query("SELECT c FROM Company c WHERE " +
            "(:companyName IS NULL OR c.companyName LIKE %:companyName%) AND " +
            "(:businessNumber IS NULL OR c.businessNumber LIKE %:businessNumber%) AND " +
            "(:ceoName IS NULL OR c.ceoName LIKE %:ceoName%) AND " +
            "(:address IS NULL OR c.address LIKE %:address%)")
    Page<Company> searchCompanies(@Param("companyName") String companyName,
                                  @Param("businessNumber") String businessNumber,
                                  @Param("ceoName") String ceoName,
                                  @Param("address") String address,
                                  Pageable pageable);
}