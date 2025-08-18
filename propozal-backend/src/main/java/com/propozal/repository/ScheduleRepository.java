package com.propozal.repository;

import com.propozal.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    // 필요 시 사용자별 스케줄 조회 같은 커스텀 메서드도 추가 가능
}

