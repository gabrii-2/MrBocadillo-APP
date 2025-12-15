package com.mrbocadillo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                /* ──────────────────────────────────────
                 *  🔓 RUTAS PÚBLICAS
                 * ────────────────────────────────────── */
                .requestMatchers("/api/auth/login", "/api/auth/registrar/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tiendas/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/bocadillos/**").permitAll()

                // 👀 NECESARIO PARA HACER PEDIDOS (el cliente debe poder leerse)
                .requestMatchers(HttpMethod.GET, "/api/clientes/**").permitAll()

                /* ──────────────────────────────────────
                 *  👤 CLIENTE — Modificar su perfil
                 * ────────────────────────────────────── */
                .requestMatchers(HttpMethod.PUT, "/api/clientes/**").hasAuthority("CLIENTE")

                /* ──────────────────────────────────────
                 *  🏪 TIENDA — Gestionar catálogo
                 * ────────────────────────────────────── */
                .requestMatchers(HttpMethod.POST, "/api/bocadillos/tienda/**").hasAuthority("TIENDA")
                .requestMatchers(HttpMethod.PUT, "/api/bocadillos/**").hasAuthority("TIENDA")
                .requestMatchers(HttpMethod.DELETE, "/api/bocadillos/**").hasAuthority("TIENDA")

                /* ──────────────────────────────────────
                 *  👑 ADMIN
                 * ────────────────────────────────────── */
                .requestMatchers("/api/admins/**").hasAuthority("ADMIN")

                /* ──────────────────────────────────────
                 *  🛒 PEDIDOS
                 *  Cliente crea pedidos → requiere login
                 *  Tienda marca como preparado → requiere login
                 * ────────────────────────────────────── */
                .requestMatchers(HttpMethod.POST, "/api/pedidos/**").hasAuthority("CLIENTE")
                .requestMatchers(HttpMethod.PUT, "/api/pedidos/**").hasAuthority("TIENDA")
                .requestMatchers(HttpMethod.GET, "/api/pedidos/**").authenticated()

                /* ──────────────────────────────────────
                 *  🔐 Cualquier otra ruta
                 * ────────────────────────────────────── */
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}