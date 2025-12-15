package com.mrbocadillo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mrbocadillo.model.Cliente;
import com.mrbocadillo.repository.ClienteRepository;
import com.mrbocadillo.repository.PedidoRepository;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> findById(Long id) {
        return clienteRepository.findById(id);
    }

    public Optional<Cliente> findByUsername(String username) {
        return clienteRepository.findByUsername(username);
    }

    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Transactional
    public void delete(Long id) {
        Cliente c = findById(id)
            .orElseThrow(() -> new RuntimeException("No existe cliente con id " + id));

        // 🔹 Primero eliminar todos los pedidos asociados
        pedidoRepository.deleteAllByCliente(c);

        // 🔹 Luego eliminar el cliente
        clienteRepository.delete(c);
    }
}
