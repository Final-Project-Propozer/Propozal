package com.propozal.service;

import com.propozal.domain.Estimate;
import com.propozal.domain.EstimateMemo;
import com.propozal.domain.User;
import com.propozal.dto.estimate.EstimateMemoRequest;
import com.propozal.dto.estimate.EstimateMemoResponse;
import com.propozal.repository.EstimateMemoRepository;
import com.propozal.repository.EstimateRepository;
import com.propozal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstimateMemoService {

    private final EstimateMemoRepository estimateMemoRepository;
    private final EstimateRepository estimateRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createMemo(Long estimateId, Long userId, EstimateMemoRequest requestDto) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new IllegalArgumentException("견적서를 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        EstimateMemo memo = EstimateMemo.builder()
                .estimate(estimate)
                .createdBy(user)
                .content(requestDto.getContent())
                .build();

        estimateMemoRepository.save(memo);
    }

    @Transactional(readOnly = true)
    public List<EstimateMemoResponse> getMemosByEstimate(Long estimateId) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new IllegalArgumentException("견적서를 찾을 수 없습니다."));

        return estimateMemoRepository.findByEstimate(estimate).stream()
                .map(EstimateMemoResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateMemo(Long memoId, Long userId, EstimateMemoRequest requestDto) {
        EstimateMemo memo = estimateMemoRepository.findById(memoId)
                .orElseThrow(() -> new IllegalArgumentException("메모를 찾을 수 없습니다."));

        if (!memo.getCreatedBy().getId().equals(userId)) {
            throw new SecurityException("본인만 수정할 수 있습니다.");
        }

        memo.updateContent(requestDto.getContent());
    }

    @Transactional
    public void deleteMemo(Long memoId, Long userId) {
        EstimateMemo memo = estimateMemoRepository.findById(memoId)
                .orElseThrow(() -> new IllegalArgumentException("메모를 찾을 수 없습니다."));

        if (!memo.getCreatedBy().getId().equals(userId)) {
            throw new SecurityException("본인만 삭제할 수 있습니다.");
        }

        estimateMemoRepository.delete(memo);
    }
}
