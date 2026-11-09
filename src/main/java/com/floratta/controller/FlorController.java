package com.floratta.controller;

import com.floratta.business.FlorService;
import com.floratta.infrastructure.entities.Flor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flores")
public class FlorController {
    private final FlorService service;

    public FlorController(FlorService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Flor cadastrar(@Valid @RequestBody Flor flor) {
        return service.cadastrar(flor);
    }

    @GetMapping
    public List<Flor> listarTodas() {
        return service.listarTodas();
    }

    @GetMapping("/{nome}")
    public Flor buscarPorNome(@PathVariable String nome) {
        return service.buscarPorNome(nome);
    }

    @PutMapping("/{nome}")
    public Flor atualizar(@PathVariable String nome, @RequestBody Flor flor) {
        return service.atualizar(nome, flor);
    }

    @DeleteMapping("/{nome}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable String nome) {
        service.excluir(nome);
    }
}
