package com.mrbocadillo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.mrbocadillo.enums.EstadoPedido;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🕒 Fecha y hora en la que se crea el pedido
    @NotNull
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // 🔗 Cliente que hace el pedido
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // 🔗 Tienda que recibe el pedido
    @ManyToOne
    @JoinColumn(name = "tienda_id", nullable = false)
    private Tienda tienda;

    @Column(length = 500)
    private String observaciones;

    // 🥪 Lista de bocadillos incluidos en el pedido
    @ManyToMany
    @JoinTable(
        name = "pedido_bocadillos",
        joinColumns = @JoinColumn(name = "pedido_id"),
        inverseJoinColumns = @JoinColumn(name = "bocadillo_id")
    )
    private List<Bocadillo> bocadillos = new ArrayList<>();

    // 💬 Estado del pedido (PENDIENTE o PREPARADO)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;

    // 💰 Precio total del pedido
    private Double total = 0.0;

    public Pedido() {}

    // 🔹 Método auxiliar para recalcular el total del pedido
    public void calcularTotal() {
        this.total = bocadillos.stream()
                .mapToDouble(Bocadillo::getPrecio)
                .sum();
    }

    // 🧱 Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Tienda getTienda() {
        return tienda;
    }

    public void setTienda(Tienda tienda) {
        this.tienda = tienda;
    }

    public List<Bocadillo> getBocadillos() {
        return bocadillos;
    }

    public void setBocadillos(List<Bocadillo> bocadillos) {
        this.bocadillos = bocadillos;
        calcularTotal();
    }

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total =total;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }   
}