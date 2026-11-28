package com.vedas.repository;

import com.vedas.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByAccountKeyIgnoreCase(String accountKey);
    Optional<UserAccount> findBySessionToken(String sessionToken);
}
