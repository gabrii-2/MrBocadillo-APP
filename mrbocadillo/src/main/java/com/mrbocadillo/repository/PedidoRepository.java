package com.mrbocadillo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrbocadillo.model.Pedido;
import com.mrbocadillo.model.Cliente;
import com.mrbocadillo.model.Tienda;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Buscar pedidos por cliente
    List<Pedido> findByCliente(Cliente cliente);

    // Buscar pedidos por tienda
    List<Pedido> findByTienda(Tienda tienda);

    // 🔹 Eliminar todos los pedidos de un cliente
    void deleteAllByCliente(Cliente cliente);

    // 🔹 Eliminar todos los pedidos de una tienda
    void deleteAllByTienda(Tienda tienda);
}
