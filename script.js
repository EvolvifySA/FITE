const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const form = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-article-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const topic = button.dataset.articleFilter;
    document.querySelectorAll("[data-article-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll(".article-card").forEach((card) => {
      card.hidden = !(topic === "todos" || card.dataset.topic === topic);
    });
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name") || "Ol?";
  const company = data.get("company") || "minha empresa";
  const contact = data.get("contact") || "meu contato";
  const need = data.get("need") || "ergonomia corporativa";
  const message = data.get("message") || "Quero entender o melhor caminho para minha operação.";
  const text = [`Ol?, sou ${name}.`, `Empresa: ${company}.`, `Contato: ${contact}.`, `Interesse: ${need}.`, `Contexto: ${message}`].join("
");
  navigator.clipboard?.writeText(text);
  formNote.textContent = "Mensagem preparada e copiada. Agora conecte este formul?rio ao WhatsApp, CRM ou email oficial da FITE.";
});
