package com.propozal.service;

import com.propozal.domain.Schedule;
import com.propozal.dto.schedule.ScheduleCreateRequest;
import com.propozal.dto.schedule.ScheduleResponse;
import com.propozal.dto.schedule.ScheduleUpdateRequest;
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
    public ScheduleResponse create(ScheduleCreateRequest req, Long currentUserId) {
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

        return ScheduleResponse.from(repo.save(s));
    }

    @Transactional(readOnly = true)
    public Page<ScheduleResponse> list(LocalDateTime from, LocalDateTime to, Long userId, Pageable pageable) {
        return repo.findInRange(from, to, userId, pageable)
                .map(ScheduleResponse::from);
    }

    @Transactional(readOnly = true)
    public ScheduleResponse get(Long id) {
        Schedule s = repo.findById(id).orElseThrow();
        return ScheduleResponse.from(s);
    }

    @Transactional
    public ScheduleResponse update(Long id, ScheduleUpdateRequest req, Long currentUserId) {
        Schedule s = repo.findById(id).orElseThrow();

        if (req.getTitle() != null)         s.setTitle(req.getTitle());
        if (req.getDescription() != null)   s.setDescription(req.getDescription());
        if (req.getScheduleType() != null)  s.setScheduleType(req.getScheduleType());
        if (req.getStartDatetime() != null) s.setStartDatetime(req.getStartDatetime());
        if (req.getEndDatetime() != null)   s.setEndDatetime(req.getEndDatetime());

        if (!s.getEndDatetime().isAfter(s.getStartDatetime())) {
            throw new IllegalArgumentException("end_datetime must be after start_datetime");
        }

        return ScheduleResponse.from(s);
    }

    @Transactional
    public void delete(Long id, Long currentUserId) {
        Schedule s = repo.findById(id).orElseThrow();
        repo.delete(s);
    }

    @Transactional(readOnly = true)
    public Page<ScheduleResponse> upcoming(Long userId, Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        return repo.findUpcoming(now, userId, pageable)
                .map(ScheduleResponse::from);
    }
}
