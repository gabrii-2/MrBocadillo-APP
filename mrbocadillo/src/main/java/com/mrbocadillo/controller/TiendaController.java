package com.mrbocadillo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mrbocadillo.model.Tienda;
import com.mrbocadillo.security.PasswordEncoderUtil;
import com.mrbocadillo.service.TiendaService;

@RestController
@RequestMapping("/api/tiendas")
public class TiendaController {

    @Autowired
    private TiendaService tiendaService;

    @GetMapping
    public List<Tienda> listar() {
        return tiendaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tienda> obtener(@PathVariable Long id) {
        return tiendaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

   

    //PutMapping("/{id}")
    //public ResponseEntity<Tienda> actualizar(@PathVariable Long id, @RequestBody Tienda datos) {
    //    Optional<Tienda> existente = tiendaService.findById(id);
    //    if (existente.isEmpty()) return ResponseEntity.notFound().build();

    //    Tienda t = existente.get();
    //    t.setNombre(datos.getNombre());
    //    t.setDireccion(datos.getDireccion());
    //    t.setTelefono(datos.getTelefono());
    //    t.setImagenUrl(datos.getImagenUrl());
    //    return ResponseEntity.ok(tiendaService.save(t));
   // }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tiendaService.delete(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{id}")
public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Tienda datos) {

    Optional<Tienda> existenteOpt = tiendaService.findById(id);
    if (existenteOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Tienda t = existenteOpt.get();

    if (datos.getNombre() != null && !datos.getNombre().isEmpty())
        t.setNombre(datos.getNombre());

    if (datos.getEmail() != null && !datos.getEmail().isEmpty())
        t.setEmail(datos.getEmail());

    if (datos.getTelefono() != null && !datos.getTelefono().isEmpty())
        t.setTelefono(datos.getTelefono());

    if (datos.getDireccion() != null && !datos.getDireccion().isEmpty())
        t.setDireccion(datos.getDireccion());

    if (datos.getImagenUrl() != null && !datos.getImagenUrl().isEmpty())
        t.setImagenUrl(datos.getImagenUrl());

    // SOLO se actualiza la contraseña si se envía
    if (datos.getPassword() != null && !datos.getPassword().isEmpty())
        t.setPassword(PasswordEncoderUtil.encode(datos.getPassword()));

    Tienda guardada = tiendaService.save(t);
    return ResponseEntity.ok(guardada);
}
}