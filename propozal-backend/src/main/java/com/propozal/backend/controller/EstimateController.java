    package com.propozal.backend.controller;

    import com.propozal.backend.domain.Estimate;
    import com.propozal.backend.dto.estimate.EstimateCreateRequest;
    import com.propozal.backend.dto.estimate.EstimateCreateResponse;
    import com.propozal.backend.service.EstimateService;
    import jakarta.validation.Valid;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;
    import java.net.URI;

    @RestController
    @RequestMapping("/api/estimate")
    @RequiredArgsConstructor
    public class EstimateController {

        private final EstimateService estimateService;

        @PostMapping
        public ResponseEntity<EstimateCreateResponse> createEstimate(
                @Valid @RequestBody EstimateCreateRequest request) {

            Estimate createdEstimate = estimateService.createEstimate(request);
            EstimateCreateResponse response = EstimateCreateResponse.from(createdEstimate);

            return ResponseEntity.created(URI.create("/api/estimate/" + response.getId()))
                    .body(response);
        }
    }