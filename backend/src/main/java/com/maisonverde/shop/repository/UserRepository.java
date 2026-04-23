package com.maisonverde.shop.repository;

import com.maisonverde.shop.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleSub(String googleSub);
    boolean existsByEmail(String email);

    @Query("""
            select u from User u
            where (:q is null or :q = ''
                    or lower(u.email) like lower(concat('%', :q, '%'))
                    or lower(u.name) like lower(concat('%', :q, '%')))
            """)
    Page<User> search(@Param("q") String q, Pageable pageable);
}
