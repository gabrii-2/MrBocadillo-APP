package com.mrbocadillo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mrbocadillo.model.Bocadillo;
import com.mrbocadillo.model.Tienda;
import com.mrbocadillo.service.BocadilloService;
import com.mrbocadillo.service.TiendaService;

@RestController
@RequestMapping("/api/bocadillos")
public class BocadilloController {

    @Autowired
    private BocadilloService bocadilloService;

    @Autowired
    private TiendaService tiendaService;

    // 🔹 LISTAR TODOS LOS BOCADILLOS
    @GetMapping
    public List<Bocadillo> listar() {
        return bocadilloService.findAll();
    }

    // 🔹 OBTENER UN BOCAILLO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Bocadillo> obtener(@PathVariable Long id) {
        return bocadilloService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 CREAR BOCAILLO PARA UNA TIENDA
    @PostMapping("/tienda/{tiendaId}")
    public ResponseEntity<?> crear(@PathVariable Long tiendaId, @RequestBody Bocadillo bocadillo) {
        Optional<Tienda> tienda = tiendaService.findById(tiendaId);
        if (tienda.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ La tienda no existe");
        }

        bocadillo.setTienda(tienda.get());
        Bocadillo nuevo = bocadilloService.save(bocadillo);
        return ResponseEntity.ok(nuevo);
    }

    // 🔹 ACTUALIZAR UN BOCAILLO
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Bocadillo datos) {
        Optional<Bocadillo> existente = bocadilloService.findById(id);
        if (existente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Bocadillo b = existente.get();
        b.setNombre(datos.getNombre());
        b.setDescripcion(datos.getDescripcion());
        b.setPrecio(datos.getPrecio());
        b.setImagenUrl(datos.getImagenUrl());

        Bocadillo actualizado = bocadilloService.save(b);
        return ResponseEntity.ok(actualizado);
    }

    // 🔹 ELIMINAR UN BOCAILLO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        bocadilloService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 LISTAR BOCADILLOS DE UNA TIENDA
    @GetMapping("/tienda/{tiendaId}/listar")
    public List<Bocadillo> obtenerPorTienda(@PathVariable Long tiendaId) {
        return bocadilloService.findByTiendaId(tiendaId);
    }
}
