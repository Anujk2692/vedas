package com.vedas.repository;

import com.vedas.model.ConsultationMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsultationMessageRepository extends JpaRepository<ConsultationMessage, Long> {
    List<ConsultationMessage> findBySessionIdOrderByCreatedAtAsc(Long sessionId);
}
