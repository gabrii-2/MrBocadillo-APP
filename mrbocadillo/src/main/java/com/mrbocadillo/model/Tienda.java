package com.mrbocadillo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "tiendas")
public class Tienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la tienda es obligatorio")
    private String nombre;

    @Email(message = "El correo electrónico no es válido")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank(message = "La contraseña no puede estar vacía")
    private String password;

    private String telefono;

    private String direccion;

    // Imagen o logo de la tienda
    @Column(columnDefinition = "TEXT")
    private String imagenUrl;

    // Estado de la tienda (por ejemplo: ACTIVA, SUSPENDIDA)
    private String estado = "ACTIVA";

    // Rol para autenticación
    private String rol = "TIENDA";

    public Tienda() {}

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol=rol;
    }
}

