package com.vedas.repository;

import com.vedas.model.PujaBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PujaBookingRepository extends JpaRepository<PujaBooking, Long> {
    List<PujaBooking> findByAccountKeyIgnoreCaseOrderByCreatedAtDesc(String accountKey);
}
