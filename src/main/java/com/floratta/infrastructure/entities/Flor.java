package com.floratta.infrastructure.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "flores")
public class Flor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    private String especie;
    private String cor;

    @Column(length = 1500)
    private String descricao;

    private String urlImagem;
    private String iluminacao;
    private String rega;
    private String tipoSolo;

    public Flor() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }
    public String getCor() { return cor; }
    public void setCor(String cor) { this.cor = cor; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getUrlImagem() { return urlImagem; }
    public void setUrlImagem(String urlImagem) { this.urlImagem = urlImagem; }
    public String getIluminacao() { return iluminacao; }
    public void setIluminacao(String iluminacao) { this.iluminacao = iluminacao; }
    public String getRega() { return rega; }
    public void setRega(String rega) { this.rega = rega; }
    public String getTipoSolo() { return tipoSolo; }
    public void setTipoSolo(String tipoSolo) { this.tipoSolo = tipoSolo; }
}
