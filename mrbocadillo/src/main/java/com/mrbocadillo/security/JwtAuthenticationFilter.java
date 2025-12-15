package com.mrbocadillo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.mrbocadillo.model.Admin;
import com.mrbocadillo.model.Cliente;
import com.mrbocadillo.model.Tienda;
import com.mrbocadillo.repository.AdminRepository;
import com.mrbocadillo.repository.ClienteRepository;
import com.mrbocadillo.repository.TiendaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TiendaRepository tiendaRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // No interceptar login o registro
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/registrar")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                String rol = null;

                // Buscar usuario
                if (clienteRepository.findByUsername(username).isPresent()) {
                    rol = "CLIENTE";
                } else if (tiendaRepository.findByUsername(username).isPresent()) {
                    rol = "TIENDA";
                } else if (adminRepository.findByUsername(username).isPresent()) {
                    rol = "ADMIN";
                }

                // Si existe y el token es válido
                if (rol != null && jwtUtil.validateToken(token)) {

                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(rol);

                    // EL PRINCIPAL DEBE SER EL USERNAME, NO EL OBJETO ENTERO
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    username, // principal
                                    null,
                                    Collections.singleton(authority)
                            );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}