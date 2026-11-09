package com.floratta.business;

import com.floratta.infrastructure.entities.Flor;
import com.floratta.infrastructure.repositories.FlorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FlorService {
    private final FlorRepository repository;

    public FlorService(FlorRepository repository) {
        this.repository = repository;
    }

    public Flor cadastrar(Flor flor) {
        flor.setId(null);
        if (repository.existsByNomeIgnoreCase(flor.getNome())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma flor com esse nome.");
        }
        return repository.save(flor);
    }

    public List<Flor> listarTodas() {
        return repository.findAll();
    }

    public Flor buscarPorNome(String nome) {
        return repository.findByNomeIgnoreCase(nome)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flor não encontrada."));
    }

    public Flor atualizar(String nomeAtual, Flor dados) {
        Flor flor = buscarPorNome(nomeAtual);
        if (dados.getNome() != null && !dados.getNome().equalsIgnoreCase(nomeAtual)
                && repository.existsByNomeIgnoreCase(dados.getNome())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma flor com esse nome.");
        }
        if (dados.getNome() != null) flor.setNome(dados.getNome());
        if (dados.getEspecie() != null) flor.setEspecie(dados.getEspecie());
        if (dados.getCor() != null) flor.setCor(dados.getCor());
        if (dados.getDescricao() != null) flor.setDescricao(dados.getDescricao());
        if (dados.getUrlImagem() != null) flor.setUrlImagem(dados.getUrlImagem());
        if (dados.getIluminacao() != null) flor.setIluminacao(dados.getIluminacao());
        if (dados.getRega() != null) flor.setRega(dados.getRega());
        if (dados.getTipoSolo() != null) flor.setTipoSolo(dados.getTipoSolo());
        return repository.save(flor);
    }

    public void excluir(String nome) {
        Flor flor = buscarPorNome(nome);
        repository.delete(flor);
    }
}
