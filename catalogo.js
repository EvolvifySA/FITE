/* ---------------------------------------------------------------------------
 * Catálogo + carrinho FITE.
 * Dados dos materiais: produtos-data.js
 * ------------------------------------------------------------------------- */
(() => {
  "use strict";

  /* Troque pelo WhatsApp oficial da FITE: 55 + DDD + número, só dígitos. */
  const WHATSAPP_NUMBER = "5583999999999";

  const PRODUTOS = window.FITE_PRODUTOS || [];
  const CATEGORIAS = window.FITE_CATEGORIAS || [];
  const CART_KEY = "fite_carrinho_v1";
  const PAGE_SIZE = 6;

  const grid = document.getElementById("produtosGrid");
  if (!grid || !PRODUTOS.length) return;

  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const money = (v) => (v > 0 ? brl.format(v) : "Gratuito");
  const wa = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  const byId = (id) => PRODUTOS.find((p) => p.id === id);
  const catLabel = (key) => (CATEGORIAS.find((c) => c.key === key) || {}).label || key;

  const coverHtml = (p, size) => `
    <div class="cover cover--${size}" data-tone="${p.tone}" aria-hidden="true">
      <span class="cover__brand">FITE</span>
      <strong class="cover__title">${p.title}</strong>
      <small class="cover__sub">${p.subtitle}</small>
      <span class="cover__tag">${catLabel(p.cat)}</span>
    </div>`;

  /* -------------------------------------------------------------------------
   * Carrinho — persistido no navegador do visitante
   * ---------------------------------------------------------------------- */
  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      return raw.filter((i) => byId(i.id)).map((i) => ({ id: i.id, qty: Math.max(1, Number(i.qty) || 1) }));
    } catch {
      return [];
    }
  }

  let cart = loadCart();
  const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const inCart = (id) => cart.some((i) => i.id === id);
  const totalItems = () => cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = () => cart.reduce((sum, i) => sum + byId(i.id).price * i.qty, 0);

  function addToCart(id) {
    const p = byId(id);
    if (!p) return;
    const line = cart.find((i) => i.id === id);
    if (line) {
      if (p.price > 0) line.qty += 1;
    } else {
      cart.push({ id, qty: 1 });
    }
    commitCart(`${p.title} adicionado ao carrinho`);
  }

  function setQty(id, qty) {
    const line = cart.find((i) => i.id === id);
    if (!line) return;
    if (qty <= 0) {
      cart = cart.filter((i) => i.id !== id);
      commitCart("Item removido do carrinho");
      return;
    }
    line.qty = Math.min(qty, 99);
    commitCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((i) => i.id !== id);
    commitCart("Item removido do carrinho");
  }

  function commitCart(toastMsg) {
    saveCart();
    updateBadge();
    renderProdutos();
    renderCart();
    updateModalCartState();
    if (toastMsg) toast(toastMsg);
  }

  /* -------------------------------------------------------------------------
   * Catálogo — busca, filtros, grid, paginação
   * ---------------------------------------------------------------------- */
  const state = { filter: "TODOS", query: "", shown: PAGE_SIZE };

  const chipsEl = document.getElementById("filterChips");
  const countEl = document.getElementById("produtoCount");
  const searchEl = document.getElementById("produtoSearch");
  const loadMoreWrap = document.getElementById("loadMoreWrap");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  function renderChips() {
    chipsEl.innerHTML = CATEGORIAS.map(
      (c) => `
      <button class="filter-chip${state.filter === c.key ? " is-active" : ""}" type="button" data-filter="${c.key}">
        ${c.label}
      </button>`
    ).join("");
  }

  function getFiltered() {
    const q = state.query.trim().toLowerCase();
    return PRODUTOS.filter((p) => {
      if (state.filter !== "TODOS" && p.cat !== state.filter) return false;
      if (q && !`${p.title} ${p.subtitle} ${p.codigo} ${catLabel(p.cat)} ${p.resumo}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }

  function renderProdutos() {
    const filtered = getFiltered();
    const visible = filtered.slice(0, state.shown);

    if (!visible.length) {
      grid.innerHTML = `<p class="catalog-empty">Nenhum material encontrado para essa busca. Ajuste o filtro ou fale com a FITE para um material sob medida.</p>`;
      countEl.textContent = "0 materiais";
      loadMoreWrap.hidden = true;
      return;
    }

    grid.innerHTML = visible
      .map((p) => {
        const added = inCart(p.id);
        return `
      <article class="produto-card${p.destaque ? " is-destaque" : ""}" data-id="${p.id}">
        <button class="produto-card__cover js-open-modal" type="button" data-id="${p.id}" aria-label="Ver detalhes de ${p.title}">
          ${coverHtml(p, "card")}
          ${p.destaque ? '<span class="badge-destaque">Mais procurado</span>' : ""}
        </button>
        <div class="produto-card__body">
          <span class="produto-card__cat">${catLabel(p.cat)} · ${p.formato}</span>
          <h3 class="produto-card__title">${p.title}</h3>
          <p class="produto-card__sub">${p.subtitle}</p>
          <div class="produto-card__price">
            ${p.oldPrice ? `<s>${brl.format(p.oldPrice)}</s>` : ""}
            <strong>${money(p.price)}</strong>
          </div>
          <div class="produto-card__actions">
            <button class="button primary js-add" type="button" data-id="${p.id}">
              ${added ? "No carrinho" : p.price > 0 ? "Adicionar" : "Quero grátis"}
            </button>
            <button class="button outline js-open-modal" type="button" data-id="${p.id}">Detalhes</button>
          </div>
        </div>
      </article>`;
      })
      .join("");

    countEl.textContent = `Exibindo ${visible.length} de ${filtered.length} materiais`;
    loadMoreWrap.hidden = visible.length >= filtered.length;
  }

  chipsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;
    state.filter = btn.dataset.filter;
    state.shown = PAGE_SIZE;
    renderChips();
    renderProdutos();
  });

  searchEl.addEventListener("input", (e) => {
    state.query = e.target.value;
    state.shown = PAGE_SIZE;
    renderProdutos();
  });

  loadMoreBtn.addEventListener("click", () => {
    state.shown += PAGE_SIZE;
    renderProdutos();
  });

  grid.addEventListener("click", (e) => {
    const add = e.target.closest(".js-add");
    if (add) {
      if (inCart(add.dataset.id)) openCart();
      else addToCart(add.dataset.id);
      return;
    }
    const open = e.target.closest(".js-open-modal");
    if (open) openModal(open.dataset.id);
  });

  /* -------------------------------------------------------------------------
   * Modal de detalhe
   * ---------------------------------------------------------------------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const modalCard = document.getElementById("modalCard");
  const modalAdd = document.getElementById("modalAdd");
  let modalId = null;

  function updateModalCartState() {
    if (!modalId) return;
    const p = byId(modalId);
    modalAdd.textContent = inCart(modalId) ? "No carrinho - ver" : p.price > 0 ? "Adicionar ao carrinho" : "Quero receber grátis";
  }

  function openModal(id) {
    const p = byId(id);
    if (!p) return;
    modalId = id;

    document.getElementById("modalCoverSlot").innerHTML = coverHtml(p, "modal");
    document.getElementById("modalCode").textContent = `${p.codigo} · ${catLabel(p.cat)}`;
    document.getElementById("modalTitle").textContent = p.title;
    document.getElementById("modalSub").textContent = p.subtitle;
    document.getElementById("modalResumo").textContent = p.resumo;
    document.getElementById("modalFormato").textContent = p.formato;
    document.getElementById("modalNivel").textContent = p.nivel;
    document.getElementById("modalEntrega").textContent = p.price > 0 ? "Acesso imediato após a compra" : "Envio imediato por email";
    document.getElementById("modalPrice").innerHTML = `
      ${p.oldPrice ? `<s>${brl.format(p.oldPrice)}</s>` : ""}
      <strong>${money(p.price)}</strong>`;
    document.getElementById("modalInclui").innerHTML = p.inclui.map((i) => `<li>${i}</li>`).join("");
    document.getElementById("modalWa").href = wa(
      `Olá! Tenho interesse no material "${p.title}" (${p.codigo}) do catálogo da FITE. Pode me passar mais detalhes?`
    );

    updateModalCartState();
    modalOverlay.hidden = false;
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    modalOverlay.hidden = true;
    modalId = null;
    if (cartOverlay.hidden) document.body.classList.remove("no-scroll");
  }

  modalAdd.addEventListener("click", () => {
    if (!modalId) return;
    if (inCart(modalId)) {
      closeModal();
      openCart();
      return;
    }
    addToCart(modalId);
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  modalCard.addEventListener("click", (e) => e.stopPropagation());
  document.getElementById("modalClose").addEventListener("click", closeModal);

  /* -------------------------------------------------------------------------
   * Painel do carrinho
   * ---------------------------------------------------------------------- */
  const cartToggle = document.getElementById("cartToggle");
  const cartCountEl = document.getElementById("cartCount");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartPanel = document.getElementById("cartPanel");
  const cartList = document.getElementById("cartList");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartFoot = document.getElementById("cartFoot");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartCheckout = document.getElementById("cartCheckout");

  function updateBadge() {
    const n = totalItems();
    cartCountEl.textContent = String(n);
    cartCountEl.hidden = n === 0;
    cartToggle.setAttribute("aria-label", n ? `Carrinho com ${n} item(ns)` : "Carrinho vazio");
  }

  function renderCart() {
    const empty = cart.length === 0;
    cartEmpty.hidden = !empty;
    cartFoot.hidden = empty;

    cartList.innerHTML = cart
      .map((line) => {
        const p = byId(line.id);
        const free = p.price === 0;
        return `
      <div class="cart-item" data-id="${p.id}">
        ${coverHtml(p, "mini")}
        <div class="cart-item__info">
          <span class="cart-item__cat">${catLabel(p.cat)}</span>
          <h4>${p.title}</h4>
          <span class="cart-item__meta">${p.formato}</span>
          <div class="cart-item__row">
            ${
              free
                ? `<span class="cart-item__free">Material gratuito</span>`
                : `<div class="qty" role="group" aria-label="Quantidade de licenças">
                     <button type="button" class="js-qty" data-id="${p.id}" data-delta="-1" aria-label="Diminuir">-</button>
                     <span>${line.qty}</span>
                     <button type="button" class="js-qty" data-id="${p.id}" data-delta="1" aria-label="Aumentar">+</button>
                   </div>`
            }
            <span class="cart-item__total">${money(p.price * line.qty)}</span>
          </div>
          <button class="cart-item__remove js-remove" type="button" data-id="${p.id}">Remover</button>
        </div>
      </div>`;
      })
      .join("");

    cartSubtotal.textContent = brl.format(subtotal());
  }

  function checkoutMessage() {
    const linhas = cart.map((line) => {
      const p = byId(line.id);
      const qtd = p.price > 0 ? ` x${line.qty}` : "";
      return `• ${p.title} (${p.codigo})${qtd} - ${money(p.price * line.qty)}`;
    });
    return [
      "Olá, FITE! Quero fechar este pedido do catálogo:",
      "",
      ...linhas,
      "",
      `Total: ${brl.format(subtotal())}`,
      "",
      "Pode me enviar as formas de pagamento e o acesso?",
    ].join("\n");
  }

  function openCart() {
    renderCart();
    cartOverlay.hidden = false;
    document.body.classList.add("no-scroll");
  }

  function closeCart() {
    cartOverlay.hidden = true;
    if (modalOverlay.hidden) document.body.classList.remove("no-scroll");
  }

  cartToggle.addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartKeep").addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) closeCart();
  });
  cartPanel.addEventListener("click", (e) => e.stopPropagation());

  cartList.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest(".js-qty");
    if (qtyBtn) {
      const line = cart.find((i) => i.id === qtyBtn.dataset.id);
      if (line) setQty(line.id, line.qty + Number(qtyBtn.dataset.delta));
      return;
    }
    const rm = e.target.closest(".js-remove");
    if (rm) removeFromCart(rm.dataset.id);
  });

  cartCheckout.addEventListener("click", () => {
    if (!cart.length) return;
    window.open(wa(checkoutMessage()), "_blank", "noopener");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!modalOverlay.hidden) closeModal();
    else if (!cartOverlay.hidden) closeCart();
  });

  /* -------------------------------------------------------------------------
   * Toast
   * ---------------------------------------------------------------------- */
  const toastEl = document.getElementById("toast");
  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  /* Atalho: qualquer link/botão .js-open-cart abre o carrinho. */
  document.querySelectorAll(".js-open-cart").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    })
  );

  renderChips();
  renderProdutos();
  renderCart();
  updateBadge();
})();
