package com.propozal.repository;

import com.propozal.domain.Schedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface AdminScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("""
       select s from Schedule s
       where (:userId is null or s.userId = :userId)
         and s.startDatetime < :toDate
         and s.endDatetime > :fromDate
       """)
    Page<Schedule> findInRange(@Param("fromDate") LocalDateTime fromDate,
                               @Param("toDate") LocalDateTime toDate,
                               @Param("userId") Long userId,
                               Pageable pageable);

    @Query("""
       select s from Schedule s
       where (:userId is null or s.userId = :userId)
         and s.endDatetime > :now
       """)
    Page<Schedule> findUpcoming(@Param("now") LocalDateTime now,
                                @Param("userId") Long userId,
                                Pageable pageable);
}
