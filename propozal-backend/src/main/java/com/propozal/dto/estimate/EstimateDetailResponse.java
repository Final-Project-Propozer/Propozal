package com.propozal.dto.estimate;

import com.propozal.domain.EmployeeProfile;
import com.propozal.domain.Estimate;
import com.propozal.domain.User;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class EstimateDetailResponse {

    private final Long id;
    private final UserDto user;
    private final String customerName;
    private final String customerEmail;
    private final String customerPhone;
    private final String customerCompanyName;
    private final String customerPosition;
    private final BigDecimal totalAmount;
    private final Integer dealStatus;
    private final LocalDate expirationDate;
    private final LocalDate sentDate;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final List<EstimateItemResponse> items;

    public static EstimateDetailResponse from(Estimate estimate, EmployeeProfile profile) {
        List<EstimateItemResponse> itemResponses = estimate.getEstimateItems().stream()
                .map(EstimateItemResponse::from)
                .collect(Collectors.toList());

        return new EstimateDetailResponse(estimate, profile, itemResponses);
    }

    private EstimateDetailResponse(Estimate estimate, EmployeeProfile profile, List<EstimateItemResponse> items) {
        this.id = estimate.getId();
        this.user = UserDto.from(estimate.getUser(), profile);
        this.customerName = estimate.getCustomerName();
        this.customerEmail = estimate.getCustomerEmail();
        this.customerPhone = estimate.getCustomerPhone();
        this.customerCompanyName = estimate.getCustomerCompanyName();
        this.customerPosition = estimate.getCustomerPosition();
        this.totalAmount = estimate.getTotalAmount();
        this.dealStatus = estimate.getDealStatus();
        this.expirationDate = estimate.getExpirationDate();
        this.sentDate = estimate.getSentDate();
        this.createdAt = estimate.getCreatedAt();
        this.updatedAt = estimate.getUpdatedAt();
        this.items = items;
    }

    // 담당자 정보를 담을 내부 DTO
    @Getter
    public static class UserDto {
        private final Long id;
        private final String username;
        private final String email;
        private final String phone;

        private UserDto(User user, EmployeeProfile profile) {
            this.id = user.getId();
            this.username = user.getName();
            this.email = user.getEmail();
            this.phone = (profile != null) ? profile.getPhoneNumber() : null;
        }

        public static UserDto from(User user, EmployeeProfile profile) {
            return new UserDto(user, profile);
        }
    }
}