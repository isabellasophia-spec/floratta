// ============================================================
// FLORATTA - JAVASCRIPT
// Este arquivo conecta a página HTML à API feita em Java/Spring Boot.
// O JavaScript cuida das ações da tela: listar, pesquisar, cadastrar,
// editar e excluir flores.
// ============================================================

// Endereço principal da API. O Spring Boot precisa estar em execução
// nessa porta e disponibilizar os endpoints definidos no Controller.
const API_URL = "http://localhost:8080/api/flores";

// Guardamos referências aos elementos HTML que serão manipulados.
const grid = document.getElementById("flower-grid");
const statusMessage = document.getElementById("status-message");
const count = document.getElementById("flower-count");
const emptyState = document.getElementById("empty-state");
const form = document.getElementById("flower-form");
const feedback = document.getElementById("form-feedback");
const dialog = document.getElementById("details-dialog");

// Lista dos campos que existem no formulário e na entidade Flor do Java.
const fields = ["nome", "especie", "cor", "descricao", "iluminacao", "rega", "tipoSolo"];

// Armazena as flores recebidas da API e a flor selecionada nos detalhes.
let flowers = [];
let selectedFlower = null;

// Mostra mensagens de carregamento ou erro na página.
function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

// Evita que textos recebidos da API sejam interpretados como código HTML.
// Isso também ajuda a proteger a página contra conteúdo HTML indesejado.
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

// Padroniza os dados de uma flor recebida do backend.
// Se algum campo vier vazio ou nulo, usamos uma string vazia.
function normalizeFlower(flower) {
  return {
    nome: flower.nome ?? "",
    especie: flower.especie ?? "",
    cor: flower.cor ?? "",
    descricao: flower.descricao ?? "",
    iluminacao: flower.iluminacao ?? "",
    rega: flower.rega ?? "",
    tipoSolo: flower.tipoSolo ?? ""
  };
}

// FUNÇÃO CENTRAL DE COMUNICAÇÃO COM A API.
// path complementa o endereço principal; options define método, corpo etc.
// Exemplo: request("", { method: "POST", body: JSON.stringify(dados) }).
async function request(path = "", options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    // Informa ao Spring Boot que estamos enviando dados no formato JSON.
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });

  // Se o servidor responder com erro HTTP, geramos um erro para o catch tratar.
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro HTTP ${response.status}`);
  }

  // DELETE pode responder com status 204 (sem conteúdo).
  if (response.status === 204) return null;

  // Converte a resposta JSON do backend em objeto JavaScript.
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// READ - LISTAR FLORES.
// Faz uma requisição GET para a API e atualiza os cartões do catálogo.
async function loadFlowers() {
  showStatus("Carregando flores...");
  try {
    // GET /api/flores deve retornar uma lista de flores em JSON.
    const data = await request();
    flowers = Array.isArray(data) ? data.map(normalizeFlower) : [];
    renderFlowers();
    showStatus(flowers.length ? `${flowers.length} flor(es) no catálogo.` : "Catálogo carregado.");
  } catch (error) {
    // Se a API estiver desligada ou o endereço estiver errado, mostramos aviso.
    flowers = [];
    renderFlowers();
    showStatus("Não foi possível carregar as flores. Confira se o Spring Boot está rodando e se a URL da API está correta.", true);
    console.error(error);
  }
}

// MOSTRAR FLORES NA TELA.
// Recebe uma lista e cria um cartão HTML para cada flor.
function renderFlowers(list = flowers) {
  count.textContent = `${list.length} ${list.length === 1 ? "flor" : "flores"}`;

  // Template string (`...`) permite montar HTML usando os dados de cada flor.
  grid.innerHTML = list.map((flower, index) => `
    <article class="flower-card">
      <div class="flower-symbol">✿</div>
      <h3>${escapeHTML(flower.nome || "Flor sem nome")}</h3>
      <p class="species">${escapeHTML(flower.especie || "Espécie não informada")}</p>
      <p class="description">${escapeHTML(flower.descricao || "Uma nova flor para conhecer e cultivar.")}</p>
      <div class="card-footer">
        <span>${escapeHTML(flower.cor || "Cor não informada")}</span>
        <button type="button" data-index="${index}" class="details-button">Ver detalhes ↗</button>
      </div>
    </article>`).join("");

  // Se não houver resultados, mostramos a mensagem de catálogo vazio.
  emptyState.classList.toggle("hidden", list.length > 0);
  grid.classList.toggle("hidden", list.length === 0);

  // Cada botão "Ver detalhes" abre a ficha da flor correspondente.
  grid.querySelectorAll(".details-button").forEach(button => {
    button.addEventListener("click", () => openDetails(list[Number(button.dataset.index)]));
  });
}

// Abre a janela com os dados completos da flor selecionada.
function openDetails(flower) {
  selectedFlower = flower;
  document.getElementById("detail-name").textContent = flower.nome;
  document.getElementById("detail-species").textContent = flower.especie || "Espécie não informada";
  document.getElementById("detail-description").textContent = flower.descricao || "Sem descrição cadastrada.";

  // Organiza as informações de cuidados em pequenos blocos.
  const details = [
    ["Cor", flower.cor], ["Iluminação", flower.iluminacao],
    ["Rega", flower.rega], ["Tipo de solo", flower.tipoSolo]
  ];

  document.getElementById("detail-list").innerHTML = details.map(([label, value]) =>
    `<div class="detail-item"><small>${label}</small><strong>${escapeHTML(value || "Não informado")}</strong></div>`
  ).join("");

  dialog.showModal();
}

// Limpa o formulário e devolve a tela ao modo de cadastro.
function resetForm() {
  form.reset();
  document.getElementById("original-name").value = "";
  document.getElementById("form-title").textContent = "Nova flor";
  document.getElementById("save-button").innerHTML = "Salvar flor <span>→</span>";
  document.getElementById("cancel-edit").classList.add("hidden");
  feedback.textContent = "";
  feedback.classList.remove("error");
}

// Preenche o formulário com os dados da flor para permitir a edição.
// Guardamos o nome original porque o projeto faz as operações pelo nome.
function startEdit(flower) {
  fields.forEach(field => {
    document.getElementById(field).value = flower[field] || "";
  });

  document.getElementById("original-name").value = flower.nome;
  document.getElementById("form-title").textContent = "Editar flor";
  document.getElementById("save-button").textContent = "Salvar alterações";
  document.getElementById("cancel-edit").classList.remove("hidden");
  feedback.textContent = "";

  dialog.close();
  document.getElementById("cadastro").scrollIntoView({ behavior: "smooth" });
}

// CREATE / UPDATE - ENVIO DO FORMULÁRIO.
// O evento submit acontece quando o usuário clica em "Salvar flor".
form.addEventListener("submit", async event => {
  // Impede o navegador de recarregar a página ao enviar o formulário.
  event.preventDefault();

  // Lê os campos HTML e monta um objeto com os dados da flor.
  const payload = {};
  fields.forEach(field => {
    payload[field] = document.getElementById(field).value.trim();
  });

  // Não permite enviar o formulário sem o nome da flor.
  if (!payload.nome) return;

  // Se existe nome original, estamos editando; caso contrário, cadastrando.
  const originalName = document.getElementById("original-name").value;
  const editing = Boolean(originalName);

  // Na edição, o nome original vai na URL, pois o backend identifica pelo nome.
  const endpoint = editing ? `/${encodeURIComponent(originalName)}` : "";
  const method = editing ? "PUT" : "POST";

  const saveButton = document.getElementById("save-button");
  saveButton.disabled = true;
  feedback.textContent = "Salvando...";
  feedback.classList.remove("error");

  try {
    // JSON.stringify transforma o objeto JavaScript em texto no formato JSON.
    // POST cadastra uma flor nova; PUT atualiza uma flor existente.
    await request(endpoint, { method, body: JSON.stringify(payload) });

    feedback.textContent = editing ? "Flor atualizada com sucesso!" : "Flor cadastrada com sucesso!";
    resetForm();

    // Atualiza o catálogo para mostrar os dados mais recentes do banco.
    await loadFlowers();
  } catch (error) {
    // Exibe uma mensagem se a API não conseguir cadastrar/editar.
    feedback.textContent = `Não foi possível salvar. ${error.message}`;
    feedback.classList.add("error");
    console.error(error);
  } finally {
    // Reativa o botão mesmo se a operação apresentar erro.
    saveButton.disabled = false;
  }
});

// Botão para cancelar uma edição e limpar o formulário.
document.getElementById("cancel-edit").addEventListener("click", resetForm);

// Botão para buscar novamente a lista no backend.
document.getElementById("refresh-button").addEventListener("click", loadFlowers);

// PESQUISA - filtra no próprio navegador as flores já carregadas.
document.getElementById("search-input").addEventListener("input", event => {
  const term = event.target.value.trim().toLocaleLowerCase("pt-BR");
  renderFlowers(flowers.filter(flower =>
    flower.nome.toLocaleLowerCase("pt-BR").includes(term)
  ));
});

// Fecha a janela de detalhes quando o usuário clica no botão de fechar.
document.getElementById("close-dialog").addEventListener("click", () => dialog.close());

// Também fecha a janela se o usuário clicar fora do conteúdo do diálogo.
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

// Botão Editar da janela de detalhes: abre o formulário preenchido.
document.getElementById("detail-edit").addEventListener("click", () => {
  if (selectedFlower) startEdit(selectedFlower);
});

// DELETE - EXCLUIR FLOR.
// Pede confirmação e envia uma requisição DELETE usando o nome da flor.
document.getElementById("detail-delete").addEventListener("click", async () => {
  if (!selectedFlower) return;

  const name = selectedFlower.nome;

  // A confirmação evita exclusões acidentais.
  if (!confirm(`Tem certeza que deseja excluir a flor "${name}"?`)) return;

  try {
    await request(`/${encodeURIComponent(name)}`, { method: "DELETE" });
    dialog.close();
    selectedFlower = null;

    // Recarrega a lista depois da exclusão.
    await loadFlowers();
  } catch (error) {
    alert(`Não foi possível excluir a flor. ${error.message}`);
    console.error(error);
  }
});

// Ao abrir a página, busca automaticamente as flores cadastradas na API.
loadFlowers();
