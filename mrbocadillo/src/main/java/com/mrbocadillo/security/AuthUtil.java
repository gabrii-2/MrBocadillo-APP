package com.mrbocadillo.security;

import com.mrbocadillo.model.Admin;
import com.mrbocadillo.model.Cliente;
import com.mrbocadillo.model.Tienda;
import com.mrbocadillo.repository.AdminRepository;
import com.mrbocadillo.repository.ClienteRepository;
import com.mrbocadillo.repository.TiendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthUtil {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TiendaRepository tiendaRepository;

    @Autowired
    private AdminRepository adminRepository;

    public Object getUsuarioActual() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<Cliente> cliente = clienteRepository.findByUsername(username);
        if (cliente.isPresent()) return cliente.get();

        Optional<Tienda> tienda = tiendaRepository.findByUsername(username);
        if (tienda.isPresent()) return tienda.get();

        Optional<Admin> admin = adminRepository.findByUsername(username);
        return admin.orElse(null);
    }
}