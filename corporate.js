(() => {
  'use strict';
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const closeNav = () => { nav?.classList.remove('is-open'); toggle?.setAttribute('aria-expanded','false'); };
  toggle?.addEventListener('click', () => toggle.setAttribute('aria-expanded',String(nav.classList.toggle('is-open'))));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click',closeNav));
  document.addEventListener('keydown',e => { if(e.key === 'Escape') closeNav(); });
  document.querySelectorAll('[data-article-filter]').forEach(button => {
    button.setAttribute('aria-pressed',String(button.classList.contains('is-active')));
    button.addEventListener('click',() => {
      document.querySelectorAll('[data-article-filter]').forEach(item => { item.classList.toggle('is-active',item === button); item.setAttribute('aria-pressed',String(item === button)); });
      document.querySelectorAll('.article-card').forEach(card => { card.hidden = button.dataset.articleFilter !== 'todos' && card.dataset.topic !== button.dataset.articleFilter; });
    });
  });
  const config = window.FITE_CONFIG || {};
  // Visitor data is not persisted; WhatsApp receives it only when the form is submitted.
  const whatsappUrl = (text,kind) => {
    const number = (kind === 'careers' ? config.careersWhatsapp || config.whatsapp || '' : config.whatsapp || '').replace(/\D/g,'');
    if (!/^55\d{10,11}$/.test(number) || number === '5583999999999') return null;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };
  window.FITE_WHATSAPP_URL = whatsappUrl;
  const send = (form,text,kind) => {
    const status = form.querySelector('.form-note');
    const url = whatsappUrl(text,kind);
    if(!url) { status.textContent = 'O contato pelo WhatsApp está temporariamente indisponível. Seus dados não foram enviados. Tente novamente mais tarde.'; return; }
    status.textContent = 'Continue no WhatsApp para revisar e enviar sua mensagem.';
    window.location.assign(url);
  };
  const identity = data => [`Nome: ${String(data.get('name') || '').trim()}`,`Cargo / profissão: ${String(data.get('role') || '').trim()}`,`Função / área de atuação: ${String(data.get('function') || '').trim()}`,`Empresa: ${String(data.get('company') || '').trim() || 'Não informada'}`,`Cidade / estado: ${String(data.get('region') || '').trim()}`];
  const careers = document.getElementById('careersForm');
  careers?.addEventListener('submit', e => {
    e.preventDefault();
    if(!careers.reportValidity()) return;
    const data = new FormData(careers);
    send(careers,['Olá, FITE! Quero apresentar meu perfil profissional.',...identity(data),`Contato: ${data.get('contact')}`,`Área de interesse: ${data.get('interest')}`,`Experiência e disponibilidade: ${data.get('experience')}`].join('\n'),'careers');
  });
  const quote = document.getElementById('quoteForm');
  quote?.addEventListener('submit', e => {
    e.preventDefault();
    if(!quote.reportValidity()) return;
    const data = new FormData(quote);
    if(!data.getAll('services').length) { quote.querySelector('.form-note').textContent = 'Selecione pelo menos uma solução para solicitar seu orçamento.'; quote.querySelector('[name="services"]').focus(); return; }
    send(quote,['Olá, FITE! Gostaria de solicitar um orçamento.',...identity(data),`Serviços: ${data.getAll('services').join(', ')}`,`Contexto: ${data.get('message') || 'A combinar'}`].join('\n'));
  });
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click',() => { quote?.querySelectorAll('[name="services"]').forEach(input => { if(input.value === link.dataset.service) input.checked = true; }); }));
  const preselect = new URLSearchParams(window.location.search).get('servico');
  if(preselect) quote?.querySelectorAll('[name="services"]').forEach(input => { if(input.value === preselect) input.checked = true; });
  const dialog = document.getElementById('leadDialog');
  const lead = document.getElementById('leadForm');
  let leadKind = 'product';
  let returnFocus;
  window.FITE_OPEN_LEAD = (title,kind = 'product') => {
    if(!dialog || !lead) return;
    returnFocus = document.activeElement;
    leadKind = kind;
    lead.reset();
    lead.querySelector('[name="product"]').value = title;
    lead.querySelector('.form-note').textContent = '';
    const company = lead.querySelector('[name="company"]');
    company.required = kind !== 'careers';
    company.placeholder = kind === 'careers' ? 'Empresa atual (opcional)' : 'Empresa ou autônomo';
    document.getElementById('leadTitle').textContent = kind === 'careers' ? 'Trabalhe com a FITE' : kind === 'schedule' ? 'Solicitar aula laboral online' : title;
    document.getElementById('leadDescription').textContent = kind === 'careers' ? 'Apresente-se pelo WhatsApp. Você poderá compartilhar seu currículo diretamente na conversa.' : kind === 'schedule' ? 'Consulte os horários com a FITE. A aula só estará agendada após a confirmação da equipe.' : 'Informe seus dados e continue no WhatsApp para consultar disponibilidade, pagamento e entrega do produto.';
    dialog.showModal();
  };
  dialog?.querySelector('.dialog-close').addEventListener('click',() => dialog.close());
  dialog?.addEventListener('close',() => returnFocus?.focus());
  dialog?.addEventListener('click',e => { const r = dialog.getBoundingClientRect(); if(e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close(); });
  lead?.addEventListener('submit',e => {
    e.preventDefault();
    if(!lead.reportValidity()) return;
    const data = new FormData(lead);
    const intro = leadKind === 'careers' ? 'Olá, FITE! Quero apresentar meu perfil profissional para oportunidades de trabalho.' : leadKind === 'schedule' ? 'Olá, FITE! Quero consultar horários para uma aula laboral online.' : 'Olá, FITE! Tenho interesse em um produto do catálogo.';
    send(lead,[intro,...identity(data),`Interesse: ${data.get('product')}`].join('\n'),leadKind);
  });
  document.querySelectorAll('[data-careers]').forEach(button => button.addEventListener('click',() => window.FITE_OPEN_LEAD('Trabalhe conosco','careers')));
  document.querySelectorAll('[data-schedule]').forEach(link => {
    if(config.schedulingUrl && /^https:\/\//.test(config.schedulingUrl)) { link.href = config.schedulingUrl; link.textContent = 'Agendar aula online ↗'; }
    else link.addEventListener('click',e => { e.preventDefault(); window.FITE_OPEN_LEAD('Aula laboral online','schedule'); });
  });
})();
