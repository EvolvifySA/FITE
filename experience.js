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
})();
