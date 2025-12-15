package com.mrbocadillo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrbocadillo.model.Cliente;
import com.mrbocadillo.model.Pedido;
import com.mrbocadillo.model.Tienda;
import com.mrbocadillo.repository.PedidoRepository;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }

    public List<Pedido> findByCliente(Cliente cliente) {
        return pedidoRepository.findByCliente(cliente);
    }

    public List<Pedido> findByTienda(Tienda tienda) {
        return pedidoRepository.findByTienda(tienda);
    }

    public Pedido save(Pedido pedido) {
        pedido.calcularTotal(); // 👈 recalcula el total antes de guardar
        return pedidoRepository.save(pedido);
    }

    public void delete(Long id) {
        pedidoRepository.deleteById(id);
    }
}