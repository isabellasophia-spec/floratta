package com.floratta.infrastructure.repositories;

import com.floratta.infrastructure.entities.Flor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FlorRepository extends JpaRepository<Flor, Long> {
    Optional<Flor> findByNomeIgnoreCase(String nome);
    boolean existsByNomeIgnoreCase(String nome);
}
