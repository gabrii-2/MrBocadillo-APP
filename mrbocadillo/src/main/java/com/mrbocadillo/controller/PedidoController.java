package com.mrbocadillo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mrbocadillo.enums.EstadoPedido;
import com.mrbocadillo.model.Bocadillo;
import com.mrbocadillo.model.Cliente;
import com.mrbocadillo.model.Pedido;
import com.mrbocadillo.model.Tienda;
import com.mrbocadillo.service.BocadilloService;
import com.mrbocadillo.service.ClienteService;
import com.mrbocadillo.service.PedidoService;
import com.mrbocadillo.service.TiendaService;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private TiendaService tiendaService;

    @Autowired
    private BocadilloService bocadilloService;

    // =====================================================
    // LISTAR TODOS LOS PEDIDOS
    // =====================================================
    @GetMapping
    public List<Pedido> listar() {
        return pedidoService.findAll();
    }

    // =====================================================
    // LISTAR PEDIDOS POR TIENDA (NECESARIO PARA TIENDA DASHBOARD)
    // =====================================================
    @GetMapping("/tienda/{tiendaId}")
    public ResponseEntity<?> listarPorTienda(@PathVariable Long tiendaId) {

        Optional<Tienda> tiendaOpt = tiendaService.findById(tiendaId);

        if (tiendaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("La tienda no existe.");
        }

        List<Pedido> pedidos = pedidoService.findByTienda(tiendaOpt.get());

        return ResponseEntity.ok(pedidos);
    }

    // =====================================================
    // CREAR PEDIDO (FUNCIONA SIN DTO)
    // =====================================================
    @PostMapping("/cliente/{clienteId}/tienda/{tiendaId}")
    public ResponseEntity<?> crear(
            @PathVariable Long clienteId,
            @PathVariable Long tiendaId,
            @RequestBody Map<String, Object> body) {

        Optional<Cliente> cliente = clienteService.findById(clienteId);
        Optional<Tienda> tienda = tiendaService.findById(tiendaId);

        if (cliente.isEmpty() || tienda.isEmpty()) {
            return ResponseEntity.badRequest().body("Cliente o tienda no encontrados.");
        }

        // Crear pedido vacío
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente.get());
        pedido.setTienda(tienda.get());
        pedido.setEstado(EstadoPedido.PENDIENTE);

        // Observaciones
        String observaciones = (String) body.getOrDefault("observaciones", "");
        pedido.setObservaciones(observaciones);

        // Lista de IDs de bocadillos que llegan del frontend
        List<Map<String, Object>> listaIds = (List<Map<String, Object>>) body.get("bocadillos");

        List<Bocadillo> bocadillosReales = new ArrayList<>();

        if (listaIds != null) {
            for (Map<String, Object> map : listaIds) {
                Long idBoc = Long.valueOf(map.get("id").toString());
                bocadilloService.findById(idBoc).ifPresent(bocadillosReales::add);
            }
        }

        // Asignar bocadillos reales
        pedido.setBocadillos(bocadillosReales);

        // Calcular total
        pedido.calcularTotal();

        // Guardar pedido (esto también llena pedido_bocadillos)
        Pedido guardado = pedidoService.save(pedido);

        return ResponseEntity.ok(guardado);
    }

    // =====================================================
    // MARCAR COMO PREPARADO
    // =====================================================
    @PutMapping("/{id}/preparar")
    public ResponseEntity<?> marcarPreparado(@PathVariable Long id) {

        Optional<Pedido> pedidoOpt = pedidoService.findById(id);
        if (pedidoOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Pedido pedido = pedidoOpt.get();
        pedido.setEstado(EstadoPedido.PREPARADO);

        return ResponseEntity.ok(pedidoService.save(pedido));
    }

    // =====================================================
    // ELIMINAR PEDIDO
    // =====================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pedidoService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
