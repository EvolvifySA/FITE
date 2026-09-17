(() => {
  'use strict';
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  const lockedCategory = grid.dataset?.category;
  const products = (window.FITE_PRODUTOS || []).filter(p => !lockedCategory || p.cat === lockedCategory);
  const categories = (window.FITE_CATEGORIAS || []).filter(c => !lockedCategory || c.key === lockedCategory);
  const requested = new URLSearchParams(location.search).get('categoria');
  let filter = lockedCategory || (categories.some(c => c.key === requested) ? requested : 'TODOS');
  let query = '';
  const money = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
  const esc = value => String(value).replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function render() {
    document.getElementById('productFilters').innerHTML = categories.map(c => `<button type="button" data-category="${esc(c.key)}" aria-pressed="${c.key === filter}">${esc(c.label)}</button>`).join('');
    const items = products.filter(p => (filter === 'TODOS' || p.cat === filter) && normalize(`${p.title} ${p.subtitle} ${p.resumo}`).includes(normalize(query.trim())));
    document.getElementById('productCount').textContent = `${items.length} ${items.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`;
    grid.innerHTML = items.length ? items.map(p => `<article class="new-product"><div class="product-cover" data-tone="${p.tone}" aria-hidden="true"><span>FITE / ${esc(p.cat)}</span><strong>${esc(p.title)}</strong><span>${esc(p.codigo)}</span></div><div class="product-content"><h2 style="font-size:1.3rem">${esc(p.title)}</h2><p>${esc(p.subtitle)}</p><details><summary>O que você encontra</summary><p>${esc(p.resumo)}</p><ul>${p.inclui.map(item => `<li>${esc(item)}</li>`).join('')}</ul><p>${esc(p.formato)} · ${esc(p.nivel)}</p></details><div class="product-price">${p.price ? money.format(p.price) : 'Gratuito'}</div><button type="button" class="button primary" data-product="${esc(p.id)}">Quero esse material ↗</button></div></article>`).join('') : '<p>Nenhum produto encontrado. Tente outro termo ou categoria.</p>';
    window.FITE_ENHANCE_DETAILS?.(grid);
  }
  document.getElementById('productFilters').addEventListener('click', e => { const button = e.target.closest('[data-category]'); if(!button) return; filter = button.dataset.category; render(); document.querySelector(`[data-category="${filter}"]`).focus(); });
  document.getElementById('productSearch').addEventListener('input',e => { query = e.target.value; render(); });
  grid.addEventListener('click',e => {
    const button=e.target.closest('[data-product]');
    if(!button) return;
    const product=products.find(p=>p.id===button.dataset.product);
    if(!product) return;
    const value=money.format(product.price)+(product.price===0?' (gratuito)':'');
    const message=`Olá! Tenho interesse nesse produto:\nNome: ${product.title}\nValor: ${value}`;
    const url=window.FITE_WHATSAPP_URL(message);
    if(url) { window.location.assign(url); return; }
    const status=document.getElementById('productStatus');
    status.hidden=false;
    status.textContent='O WhatsApp da FITE está temporariamente indisponível. Tente novamente mais tarde.';
    status.scrollIntoView?.({behavior:'smooth',block:'center'});
  });
  render();
})();
