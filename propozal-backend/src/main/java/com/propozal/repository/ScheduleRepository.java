package com.propozal.repository;

import com.propozal.domain.Schedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    @Query("""
      select s from Schedule s
      where (:userId is null or s.userId = :userId)
        and s.startDatetime < :to and s.endDatetime > :from
      """)
    Page<Schedule> findInRange(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("userId") Long userId,
            Pageable pageable
    );
}
