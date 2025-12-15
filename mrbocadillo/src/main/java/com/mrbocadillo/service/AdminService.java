package com.mrbocadillo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mrbocadillo.model.Admin;
import com.mrbocadillo.repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public Optional<Admin> findById(Long id) {
        return adminRepository.findById(id);
    }

    public Optional<Admin> findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    public void delete(Long id) {
        adminRepository.deleteById(id);
    }
}