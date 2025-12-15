package com.mrbocadillo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrbocadillo.model.Tienda;

@Repository
public interface TiendaRepository extends JpaRepository<Tienda, Long> {
    Optional<Tienda> findByUsername(String username);
    boolean existsByEmail(String email);
}  