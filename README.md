# Floratta — Catálogo de Flores e Cuidados

Projeto Spring Boot com Java, PostgreSQL e uma interface web simples e responsiva para cadastrar e organizar flores.

## Requisitos
- JDK 21 ou superior (o JDK 25 pode ser usado; o Maven compila para Java 21)
- PostgreSQL
- IntelliJ IDEA ou outra IDE com Maven

## Configuração do banco
Crie o banco no pgAdmin/Query Tool:

```sql
CREATE DATABASE floratta;
```

A configuração padrão está em `src/main/resources/application.properties` e usa:
- host: `localhost`
- porta: `5432`
- banco: `floratta`
- usuário: `postgres`
- senha padrão configurada: `postgres`

Se a sua senha for diferente, altere `spring.datasource.password` no `application.properties`, ou defina a variável de ambiente `DB_PASSWORD`. A URL, usuário e senha também podem ser substituídos pelas variáveis `DB_URL`, `DB_USERNAME` e `DB_PASSWORD`.

## Abrir no IntelliJ
1. Extraia o ZIP.
2. Abra a pasta `floratta` (ela contém o `pom.xml`).
3. Aguarde o Maven carregar as dependências.
4. Confirme que o SDK do projeto está definido para um JDK 21 ou superior. Se usar JDK 25, o Maven continua compilando com alvo Java 21.
5. Inicie o serviço PostgreSQL e execute `FlorattaApplication.java`.
6. Acesse http://localhost:8081.

## API REST
Base: `/api/flores`
- `POST /api/flores` — cadastrar flor
- `GET /api/flores` — listar flores
- `GET /api/flores/{id}` — consultar uma flor
- `PUT /api/flores/{id}` — atualizar flor
- `DELETE /api/flores/{id}` — excluir flor

Exemplo de JSON para cadastro:

```json
{
  "nome": "Rosa",
  "especie": "Rosa gallica",
  "cor": "Rosa",
  "descricao": "Flor ornamental muito popular.",
  "urlImagem": "https://exemplo.com/rosa.jpg",
  "iluminacao": "Sol da manhã",
  "rega": "Regar quando a superfície do solo começar a secar",
  "tipoSolo": "Fértil e bem drenado"
}
```

O Hibernate cria/atualiza a tabela `flores` automaticamente com `ddl-auto=update`.

## Endpoints da API (operações por nome)

- `POST /api/flores` — cadastrar uma flor.
- `GET /api/flores` — listar todas as flores.
- `GET /api/flores/{nome}` — consultar uma flor pelo nome.
- `PUT /api/flores/{nome}` — atualizar uma flor localizada pelo nome.
- `DELETE /api/flores/{nome}` — excluir uma flor localizada pelo nome.

Para evitar ambiguidades, o sistema não permite duas flores com o mesmo nome (ignorando maiúsculas/minúsculas). O ID continua existindo internamente como chave primária do banco, mas não é usado nos endereços da API para consultar, atualizar ou excluir.
