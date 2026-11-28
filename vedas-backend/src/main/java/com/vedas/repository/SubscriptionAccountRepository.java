package com.vedas.repository;

import com.vedas.model.SubscriptionAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionAccountRepository extends JpaRepository<SubscriptionAccount, String> {
    Optional<SubscriptionAccount> findByAccountKeyIgnoreCase(String accountKey);
}
