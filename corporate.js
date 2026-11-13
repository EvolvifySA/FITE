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
  const val = (data,key) => String(data.get(key) || '').trim();
  const identity = data => [['Nome',val(data,'name')],['Cargo / profissão',val(data,'role')],['Função / área de atuação',val(data,'function')],['Empresa',val(data,'company') || 'Não informada'],['Cidade / estado',val(data,'region')]];
  const lines = pairs => pairs.map(([label,value]) => `${label}: ${value}`);
  const emailTarget = kind => {
    const address = String((kind === 'careers' ? config.careersEmail || config.email : config.email) || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) ? address : null;
  };
  // E-mail via FormSubmit (https://formsubmit.co): the form is posted into a hidden iframe so attachments work on a static site.
  const postEmail = window.FITE_POST_EMAIL || ((address,fields,files = []) => new Promise(resolve => {
    const name = `fite-mail-${Date.now()}`;
    const frame = document.createElement('iframe');
    frame.name = name; frame.hidden = true; frame.title = 'Envio do formulário';
    const form = document.createElement('form');
    form.action = `https://formsubmit.co/${encodeURIComponent(address)}`;
    form.method = 'POST'; form.enctype = 'multipart/form-data'; form.target = name; form.hidden = true;
    Object.entries({_captcha:'false',_template:'table',...fields}).forEach(([key,value]) => { const input = document.createElement('input'); input.type = 'hidden'; input.name = key; input.value = value; form.append(input); });
    files.forEach(([key,file]) => { const input = document.createElement('input'); input.type = 'file'; input.name = key; const transfer = new DataTransfer(); transfer.items.add(file); input.files = transfer.files; form.append(input); });
    let done = false;
    const finish = ok => { if(done) return; done = true; clearTimeout(timer); setTimeout(() => { frame.remove(); form.remove(); },1000); resolve(ok); };
    const timer = setTimeout(() => finish(false),60000);
    // The empty iframe may fire its own load first; only the cross-origin response counts as delivered.
    frame.addEventListener('load',() => { try { if(frame.contentWindow.location.href === 'about:blank') return; } catch { /* cross-origin: FormSubmit answered */ } finish(true); });
    document.body.append(frame,form);
    form.submit();
  }));
  const MAX_RESUME = 5 * 1024 * 1024;
  const careers = document.getElementById('careersForm');
  const showFileName = file => { const label = careers?.querySelector('[data-file-name]'); if(label) label.textContent = file ? file.name : 'Nenhum arquivo selecionado'; };
  careers?.querySelector('input[type="file"]')?.addEventListener('change',e => showFileName(e.target.files?.[0]));
  careers?.addEventListener('submit', async e => {
    e.preventDefault();
    if(!careers.reportValidity()) return;
    const note = careers.querySelector('.form-note');
    const button = careers.querySelector('[type="submit"]');
    const data = new FormData(careers);
    const resume = data.get('attachment');
    if(resume && resume.size > MAX_RESUME) { note.textContent = 'O currículo deve ter no máximo 5 MB. Envie um arquivo menor.'; return; }
    const pairs = [...identity(data),['E-mail',val(data,'email')],['WhatsApp',val(data,'phone')],['Área de interesse',val(data,'interest')],['Experiência e disponibilidade',val(data,'experience')]];
    const address = emailTarget('careers');
    if(!address) { note.textContent = 'O envio está temporariamente indisponível. Seus dados não foram enviados. Tente novamente mais tarde.'; return; }
    if(button) button.disabled = true;
    note.textContent = 'Enviando seu perfil e currículo…';
    const mailed = await postEmail(address,{_subject:`Trabalhe conosco: ${val(data,'name')} (${val(data,'interest')})`,_replyto:val(data,'email'),...Object.fromEntries(pairs)},resume && resume.size ? [['attachment',resume]] : []);
    if(button) button.disabled = false;
    if(mailed) { careers.reset(); showFileName(null); note.textContent = 'Recebemos seu perfil e currículo. Obrigado! A equipe da FITE entrará em contato.'; }
    else note.textContent = 'Não foi possível enviar agora. Tente novamente em alguns instantes.';
  });
  const quote = document.getElementById('quoteForm');
  quote?.addEventListener('submit', async e => {
    e.preventDefault();
    if(!quote.reportValidity()) return;
    const note = quote.querySelector('.form-note');
    const data = new FormData(quote);
    if(!data.getAll('services').length) { note.textContent = 'Selecione pelo menos uma solução para solicitar seu orçamento.'; quote.querySelector('[name="services"]').focus(); return; }
    const address = emailTarget('quote');
    if(!address) { note.textContent = 'O envio por e-mail está temporariamente indisponível. Seus dados não foram enviados. Tente novamente mais tarde.'; return; }
    const pairs = [...identity(data),['E-mail',val(data,'email')],['WhatsApp',val(data,'phone') || 'Não informado'],['Serviços',data.getAll('services').join(', ')],['Cupom',val(data,'coupon') || 'Nenhum'],['Contexto',val(data,'message') || 'A combinar']];
    const button = quote.querySelector('[type="submit"]');
    if(button) button.disabled = true;
    note.textContent = 'Enviando sua solicitação…';
    const sent = await postEmail(address,{_subject:`Solicitação de proposta: ${val(data,'company')}`,_replyto:val(data,'email'),...Object.fromEntries(pairs)});
    if(button) button.disabled = false;
    if(sent) { quote.reset(); note.textContent = 'Recebemos sua solicitação! A equipe da FITE vai responder pelo e-mail informado.'; }
    else note.textContent = 'Não foi possível enviar agora. Tente novamente em alguns instantes.';
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
    send(lead,[intro,...lines(identity(data)),`Interesse: ${data.get('product')}`].join('\n'),leadKind);
  });
  document.querySelectorAll('[data-careers]').forEach(button => button.addEventListener('click',() => window.FITE_OPEN_LEAD('Trabalhe conosco','careers')));
  document.querySelectorAll('[data-schedule]').forEach(link => {
    if(config.schedulingUrl && /^https:\/\//.test(config.schedulingUrl)) { link.href = config.schedulingUrl; link.textContent = 'Agendar aula online ↗'; }
    else link.addEventListener('click',e => { e.preventDefault(); window.FITE_OPEN_LEAD('Aula laboral online','schedule'); });
  });
})();
