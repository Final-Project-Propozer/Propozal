package com.propozal.service;

import com.propozal.domain.Schedule;
import com.propozal.repository.ScheduleRepository;
import com.propozal.domain.User;
import com.propozal.dto.schedule.ScheduleCreateRequestDto;
import com.propozal.dto.schedule.ScheduleUpdateRequestDto;
import com.propozal.dto.schedule.ScheduleResponseDto;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    // 전체 스케줄 조회
    public List<ScheduleResponseDto> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(ScheduleResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 단일 스케줄 조회
    public ScheduleResponseDto getSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + id));
        return ScheduleResponseDto.fromEntity(schedule);
    }

    // 스케줄 생성
    public ScheduleResponseDto createSchedule(ScheduleCreateRequestDto request) {
        // 실제 구현에서는 로그인한 사용자 정보를 받아와야 함
        User user = getUserById(request.getUserId());

        Schedule schedule = Schedule.builder()
                .user(user)
                .scheduleType(request.getScheduleType())
                .title(request.getTitle())
                .description(request.getDescription())
                .startDatetime(request.getStartDatetime())
                .endDatetime(request.getEndDatetime())
                .customer(request.getCustomer())
                .notify(request.getNotify())
                .build();

        System.out.println("빌더로 생성된 Schedule:");
        System.out.println("customer = " + schedule.getCustomer());
        System.out.println("notify = " + schedule.getNotify());

        Schedule saved = scheduleRepository.save(schedule);
        return ScheduleResponseDto.fromEntity(saved);
    }

    // 스케줄 수정
    public ScheduleResponseDto updateSchedule(Long id, ScheduleUpdateRequestDto request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + id));

        schedule.setScheduleType(request.getScheduleType());
        schedule.setTitle(request.getTitle());
        schedule.setDescription(request.getDescription());
        schedule.setStartDatetime(request.getStartDatetime());
        schedule.setEndDatetime(request.getEndDatetime());

        Schedule updated = scheduleRepository.save(schedule);
        return ScheduleResponseDto.fromEntity(updated);
    }

    // 스케줄 삭제
    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

    // 사용자 조회 (임시 메서드)
    private User getUserById(Long userId) {
        // 실제 구현에서는 UserService 또는 SecurityContext에서 가져와야 함
        User user = new User();
        user.setId(userId);
        return user;
    }
}
