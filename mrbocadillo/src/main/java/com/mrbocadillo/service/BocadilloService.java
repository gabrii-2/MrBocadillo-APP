package com.mrbocadillo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrbocadillo.model.Bocadillo;
import com.mrbocadillo.model.Tienda;
import com.mrbocadillo.repository.BocadilloRepository;

@Service
public class BocadilloService {

    @Autowired
    private BocadilloRepository bocadilloRepository;

    public List<Bocadillo> findAll() {
        return bocadilloRepository.findAll();
    }

    public Optional<Bocadillo> findById(Long id) {
        return bocadilloRepository.findById(id);
    }

    public Bocadillo save(Bocadillo bocadillo) {
        return bocadilloRepository.save(bocadillo);
    }

    public void delete(Long id) {
        bocadilloRepository.deleteById(id);
    }

    public List<Bocadillo> findByTiendaId(Long tiendaId) {
        return bocadilloRepository.findByTiendaId(tiendaId);
    }

    // 🔹 Método adicional para borrar todos los bocadillos de una tienda
    public void deleteAllByTienda(Tienda tienda) {
        bocadilloRepository.deleteAllByTienda(tienda);
    }
}
