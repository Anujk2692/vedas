package com.vedas.repository;

import com.vedas.model.ConsultationSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsultationSessionRepository extends JpaRepository<ConsultationSession, Long> {
    List<ConsultationSession> findByAccountKeyIgnoreCaseOrderByCreatedAtDesc(String accountKey);
}
