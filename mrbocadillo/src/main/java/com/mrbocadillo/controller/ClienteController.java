package com.mrbocadillo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mrbocadillo.model.Cliente;
import com.mrbocadillo.security.PasswordEncoderUtil;
import com.mrbocadillo.service.ClienteService;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // LISTAR TODOS LOS CLIENTES
    @GetMapping
    public List<Cliente> listar() {
        return clienteService.findAll();
    }

    // OBTENER UN CLIENTE POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtener(@PathVariable Long id) {
        return clienteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // REGISTRAR NUEVO CLIENTE
    @PostMapping("/registrar")
    public ResponseEntity<Cliente> registrar(@RequestBody Cliente cliente) {
        cliente.setPassword(PasswordEncoderUtil.encode(cliente.getPassword()));
        cliente.setRol("CLIENTE");
        Cliente nuevo = clienteService.save(cliente);
        return ResponseEntity.ok(nuevo);
    }

    // ACTUALIZAR CLIENTE
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Long id, @RequestBody Cliente datos) {
        Optional<Cliente> existente = clienteService.findById(id);
        if (existente.isEmpty()) return ResponseEntity.notFound().build();

        Cliente c = existente.get();

        if (datos.getNombre() != null && !datos.getNombre().isBlank()) c.setNombre(datos.getNombre());
        if (datos.getApellido() != null && !datos.getApellido().isBlank()) c.setApellido(datos.getApellido());
        if (datos.getEmail() != null && !datos.getEmail().isBlank()) c.setEmail(datos.getEmail());
        if (datos.getTelefono() != null) c.setTelefono(datos.getTelefono());
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) 
            c.setPassword(PasswordEncoderUtil.encode(datos.getPassword()));

        // ⚠️ Username y rol NO se tocan NUNCA
        return ResponseEntity.ok(clienteService.save(c));
    }

    // ELIMINAR CLIENTE (y primero sus pedidos)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.delete(id); // ✅ delete en ClienteService ya borra pedidos asociados
        return ResponseEntity.noContent().build();
    }
}
