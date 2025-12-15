package com.mrbocadillo.controller;


import com.mrbocadillo.model.Admin;
import com.mrbocadillo.model.Cliente;
import com.mrbocadillo.model.Tienda;
import com.mrbocadillo.repository.AdminRepository;
import com.mrbocadillo.repository.ClienteRepository;
import com.mrbocadillo.repository.TiendaRepository;
import com.mrbocadillo.security.JwtUtil;
import com.mrbocadillo.security.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Controlador de autenticación.
 * Permite registrar usuarios y hacer login devolviendo un token JWT.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TiendaRepository tiendaRepository;

    @Autowired
    private AdminRepository adminRepository;

    // 🟢 Registro de cliente
    @PostMapping("/registrar/cliente")
    public ResponseEntity<?> registrarCliente(@RequestBody Cliente cliente) {
        if (clienteRepository.findByUsername(cliente.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya está en uso");
        }

        cliente.setPassword(PasswordEncoderUtil.encode(cliente.getPassword()));
        cliente.setRol("CLIENTE");
        clienteRepository.save(cliente);

        return ResponseEntity.ok("Cliente registrado correctamente");
    }

    // 🟢 Registro de tienda
    @PostMapping("/registrar/tienda")
    public ResponseEntity<?> registrarTienda(@RequestBody Tienda tienda) {
        if (tiendaRepository.findByUsername(tienda.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya está en uso");
        }

        tienda.setPassword(PasswordEncoderUtil.encode(tienda.getPassword()));
        tienda.setRol("TIENDA");
        tiendaRepository.save(tienda);

        return ResponseEntity.ok("Tienda registrada correctamente");
    }

    // 🔐 Login (para cualquier rol)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        // Cliente
        Optional<Cliente> clienteOpt = clienteRepository.findByUsername(username);
        if (clienteOpt.isPresent() && PasswordEncoderUtil.matches(password, clienteOpt.get().getPassword())) {
            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "rol", "CLIENTE",
                    "username", username
            ));
        }

        // Tienda
        Optional<Tienda> tiendaOpt = tiendaRepository.findByUsername(username);
        if (tiendaOpt.isPresent() && PasswordEncoderUtil.matches(password, tiendaOpt.get().getPassword())) {
            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "rol", "TIENDA",
                    "username", username
            ));
        }

        // Admin
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent() && PasswordEncoderUtil.matches(password, adminOpt.get().getPassword())) {
            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "rol", "ADMIN",
                    "username", username
            ));
        }

        return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
    }
}