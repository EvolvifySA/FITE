(() => {
  'use strict';
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  // Animate both expansion and collapse; the native details behavior remains the fallback.
  window.FITE_ENHANCE_DETAILS = (root = document) => {
    root.querySelectorAll('details').forEach(details => {
      if(details.dataset.animated || !details.animate) return;
      details.dataset.animated = 'true';
      const summary = details.querySelector('summary');
      if(!summary) return;
      let animation;
      let targetOpen = details.open;
      summary.setAttribute('aria-expanded',String(targetOpen));
      summary.addEventListener('click', event => {
        if(reduced) return;
        event.preventDefault();
        const start = details.getBoundingClientRect().height;
        targetOpen = !targetOpen;
        if(animation) { animation.onfinish=null; animation.cancel(); }
        details.open=true;
        const end = targetOpen ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height;
        details.style.overflow='hidden';
        summary.setAttribute('aria-expanded',String(targetOpen));
        animation=details.animate([{height:`${start}px`},{height:`${end}px`}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
        animation.onfinish=()=>{ details.open=targetOpen; details.style.overflow=''; animation=null; };
      });
    });
  };
  window.FITE_ENHANCE_DETAILS();
  // The supplied reference images open at a readable size in an accessible dialog.
  const sources=document.querySelectorAll('[data-lightbox]');
  if(sources.length) {
    const dialog=document.createElement('dialog');
    dialog.className='reference-dialog';
    dialog.setAttribute('aria-label','Referência de Helmar Aquino');
    dialog.innerHTML='<button type="button" class="reference-close" aria-label="Fechar imagem">×</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.append(dialog);
    let opener;
    sources.forEach(link=>link.addEventListener('click',event=>{
      event.preventDefault(); opener=link;
      const caption=link.dataset.caption || 'Registro profissional de Helmar Aquino';
      dialog.querySelector('img').src=link.href;
      dialog.querySelector('img').alt=caption;
      dialog.querySelector('figcaption').textContent=caption;
      dialog.showModal();
    }));
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',()=>opener?.focus());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  }
  // Floating WhatsApp button; falls back to the home contact form while the number is not configured.
  if(!document.body) return;
  const siteRoot=document.currentScript?.src || window.location.href;
  const number=String(window.FITE_CONFIG?.whatsapp || '').replace(/\D/g,'');
  const whatsapp=document.createElement('a');
  whatsapp.className='whatsapp-float';
  whatsapp.setAttribute('aria-label','Fale com a FITE pelo WhatsApp');
  whatsapp.href=number ? `https://wa.me/${number}?text=${encodeURIComponent('Olá! Vim pelo site da FITE e gostaria de mais informações.')}` : new URL('index.html#contato',siteRoot).href;
  if(number) { whatsapp.target='_blank'; whatsapp.rel='noopener'; }
  whatsapp.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.8c-1.96 0-3.88-.53-5.55-1.52l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.78 10.78 0 0 1 5.22 16c0-5.96 4.85-10.8 10.82-10.8 5.96 0 10.79 4.84 10.79 10.8 0 5.96-4.84 10.8-10.79 10.8Zm5.92-8.09c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.1-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.27-.63-.54-.55-.73-.56h-.63c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.71 0 1.6 1.17 3.14 1.33 3.36.16.22 2.3 3.5 5.56 4.91.78.34 1.38.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.13-.3-.21-.62-.37Z"/></svg>';
  document.body.append(whatsapp);
})();
