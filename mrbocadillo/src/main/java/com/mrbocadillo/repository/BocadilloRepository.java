package com.mrbocadillo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mrbocadillo.model.Bocadillo;
import com.mrbocadillo.model.Tienda;
import java.util.List;

public interface BocadilloRepository extends JpaRepository<Bocadillo, Long> {

    // Listar todos los bocadillos de una tienda
    List<Bocadillo> findByTiendaId(Long tiendaId);

    // Borrar todos los bocadillos de una tienda
    void deleteAllByTienda(Tienda tienda);
}
