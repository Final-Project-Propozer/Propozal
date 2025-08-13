package com.propozal.service;

import com.propozal.domain.Schedule;
import com.propozal.dto.schedule.ScheduleCreateRequestDto;
import com.propozal.dto.schedule.ScheduleResponseDto;
import com.propozal.dto.schedule.ScheduleUpdateRequestDto;
import com.propozal.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository repo;

    @Transactional
    public ScheduleResponseDto create(ScheduleCreateRequestDto req, Long currentUserId) {
        LocalDateTime start = req.getStartDatetime();
        LocalDateTime end = (req.getEndDatetime() == null) ? start.plusMinutes(30) : req.getEndDatetime();

        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("end_datetime must be after start_datetime");
        }

        Schedule s = new Schedule();
        s.setUserId(currentUserId);
        s.setScheduleType(req.getScheduleType());
        s.setTitle(req.getTitle());
        s.setDescription(req.getDescription());
        s.setStartDatetime(start);
        s.setEndDatetime(end);

        return ScheduleResponseDto.from(repo.save(s));
    }

    @Transactional(readOnly = true)
    public Page<ScheduleResponseDto> list(LocalDateTime from, LocalDateTime to, Long userId, Pageable pageable) {
        return repo.findInRange(from, to, userId, pageable)
                .map(ScheduleResponseDto::from);
    }

    @Transactional(readOnly = true)
    public ScheduleResponseDto get(Long id) {
        Schedule s = repo.findById(id).orElseThrow();
        return ScheduleResponseDto.from(s);
    }

    @Transactional
    public ScheduleResponseDto update(Long id, ScheduleUpdateRequestDto req, Long currentUserId) {
        Schedule s = repo.findById(id).orElseThrow();

        if (req.getTitle() != null)         s.setTitle(req.getTitle());
        if (req.getDescription() != null)   s.setDescription(req.getDescription());
        if (req.getScheduleType() != null)  s.setScheduleType(req.getScheduleType());
        if (req.getStartDatetime() != null) s.setStartDatetime(req.getStartDatetime());
        if (req.getEndDatetime() != null)   s.setEndDatetime(req.getEndDatetime());

        if (!s.getEndDatetime().isAfter(s.getStartDatetime())) {
            throw new IllegalArgumentException("end_datetime must be after start_datetime");
        }

        return ScheduleResponseDto.from(s);
    }

    @Transactional
    public void delete(Long id, Long currentUserId) {
        Schedule s = repo.findById(id).orElseThrow();
        repo.delete(s);
    }

    @Transactional(readOnly = true)
    public Page<ScheduleResponseDto> upcoming(Long userId, Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        return repo.findUpcoming(now, userId, pageable)
                .map(ScheduleResponseDto::from);
    }
}
