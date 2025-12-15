package com.mrbocadillo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mrbocadillo.model.Tienda;
import com.mrbocadillo.repository.TiendaRepository;
import com.mrbocadillo.repository.BocadilloRepository;

@Service
public class TiendaService {

    @Autowired
    private TiendaRepository tiendaRepository;

    @Autowired
    private BocadilloRepository bocadilloRepository;

    // Listar todas las tiendas
    public List<Tienda> findAll() {
        return tiendaRepository.findAll();
    }

    // Buscar tienda por ID
    public Optional<Tienda> findById(Long id) {
        return tiendaRepository.findById(id);
    }

    // Buscar tienda por username
    public Optional<Tienda> findByUsername(String username) {
        return tiendaRepository.findByUsername(username);
    }

    // Guardar o actualizar tienda
    public Tienda save(Tienda tienda) {
        return tiendaRepository.save(tienda);
    }

    // 🔹 Eliminar tienda y todos sus bocadillos asociados
    @Transactional
    public void delete(Long id) {
        Tienda t = findById(id)
            .orElseThrow(() -> new RuntimeException("No existe tienda con id " + id));

        // Primero eliminar todos los bocadillos asociados
        bocadilloRepository.deleteAllByTienda(t);

        // Luego eliminar la tienda
        tiendaRepository.delete(t);
    }
}
