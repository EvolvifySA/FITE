const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = process.cwd();
const files = ['index.html','produtos/index.html','ebooks/index.html','artigos/index.html','trabalhe-conosco/index.html','nr-17/index.html','psicossociais/index.html','ergonomia-no-trabalho/index.html','impacto-da-usabilidade/index.html','analise-da-confiabilidade/index.html','o-que-e-ergonomia/index.html','seguranca-do-trabalho/index.html','cat/index.html','apr/index.html','gro/index.html','pcmso/index.html','sesmt/index.html','rat/index.html','pgr/index.html','riscos-ergonomicos/index.html','solucoes/ergonomia/index.html','solucoes/ginastica-laboral/index.html','solucoes/qualidade-de-vida/index.html','solucoes/palestras-sipat/index.html','solucoes/gestao-de-riscos/index.html','solucoes/inclusao-retorno/index.html','solucoes/exoesqueletos-inovacao/index.html','solucoes/mentoria/index.html','solucoes/riscos-psicossociais/index.html','solucoes/quick-massage/index.html'];
let checked = 0;
for(const file of files) {
  const html = fs.readFileSync(file,'utf8');
  const base = html.includes('<base href="../">') ? root : path.dirname(path.resolve(file));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`Duplicate IDs: ${file}`);
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replace(/&amp;/g,'&');
    if(/^(?:https?:|mailto:|tel:|data:)/.test(value)) continue;
    const [pathname,hash] = value.split('#');
    const target = pathname ? path.resolve(base,decodeURI(pathname.split('?')[0])) : path.resolve(file);
    assert(fs.existsSync(target),`Missing ${value} in ${file}`);
    if(hash && target.endsWith('.html')) {
      const dest = fs.readFileSync(target,'utf8');
      assert(dest.includes(`id="${hash}"`),`Missing anchor ${value} in ${file}`);
    }
    checked++;
  }
}
const productContext = {window:{}};
vm.runInNewContext(fs.readFileSync('produtos-data.js','utf8'),productContext);
const data = productContext.window;
assert.equal(data.FITE_PRODUTOS.length,12);
function whatsappHelper(whatsapp) {
  const window = {FITE_CONFIG:{whatsapp},location:{search:''}};
  vm.runInNewContext(fs.readFileSync('corporate.js','utf8'),{window,document:{querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,addEventListener(){}},location:window.location,URLSearchParams});
  return window.FITE_WHATSAPP_URL;
}
function catalog(category,search='',lockedCategory,whatsapp='5511987654321') {
  const elements = new Map();
  const el = id => { if(!elements.has(id)) elements.set(id,{innerHTML:'',textContent:'',events:{},addEventListener(e,fn){this.events[e]=fn;},focus(){}}); return elements.get(id); };
  el('productGrid').dataset = {category:lockedCategory};
  let selected,destination;
  vm.runInNewContext(fs.readFileSync('products.js','utf8'),{window:{...data,FITE_WHATSAPP_URL:whatsappHelper(whatsapp),location:{assign:url=>{destination=url;selected=new URL(url).searchParams.get('text');}}},document:{getElementById:el,querySelector:el},location:{search:`?categoria=${category}`},URLSearchParams,Intl});
  if(search) el('productSearch').events.input({target:{value:search}});
  return {el,selected:()=>selected,destination:()=>destination};
}
let c = catalog('EBOOK');
assert.equal(c.el('productCount').textContent,'4 produtos encontrados');
c.el('productGrid').events.click({target:{closest:()=>({dataset:{product:'fite-02'}})}});
assert(c.selected().includes('AEP e AET'));
assert(c.selected().includes('Tenho interesse nesse produto:'));
assert(/Valor: R\$\s55,00/.test(c.selected()));
assert.equal(new URL(c.destination()).hostname,'wa.me');
c = catalog('EBOOK');
c.el('productGrid').events.click({target:{closest:()=>({dataset:{product:'fite-01'}})}});
assert(/Valor: R\$\s55,00/.test(c.selected()));
assert(data.FITE_PRODUTOS.every(p => p.price === 55 && !p.oldPrice),'All catalog items must cost R$ 55');
c = catalog('EBOOK','',undefined,'');
c.el('productGrid').events.click({target:{closest:()=>({dataset:{product:'fite-02'}})}});
assert.equal(c.destination(),undefined);
assert.equal(c.el('productStatus').hidden,false);
c = catalog('TREINAMENTO');
assert.equal(c.el('productCount').textContent,'2 produtos encontrados');
c = catalog('invalid','absenteismo');
assert.equal(c.el('productCount').textContent,'1 produto encontrado');
c = catalog('TODOS','nada-que-exista');
assert.equal(c.el('productCount').textContent,'0 produtos encontrados');
c = catalog('TREINAMENTO','','EBOOK');
assert.equal(c.el('productCount').textContent,'4 produtos encontrados');
assert(!c.el('productGrid').innerHTML.includes('Mentoria em'));
(async () => {
// Quote form: e-mail only (FormSubmit), with coupon. Transport is faked; nothing leaves the machine.
function contact(config,mailResult = true) {
  const quote = {events:{},note:{},checked:[],button:{},reset(){this.wasReset = true;},reportValidity:()=>true,querySelector:s=>s === '.form-note' ? quote.note : s === '[type="submit"]' ? quote.button : {focus(){}},querySelectorAll:()=>quote.checked,addEventListener(e,fn){this.events[e]=fn;}};
  let destination;
  const mails = [];
  const window = {FITE_CONFIG:config,FITE_POST_EMAIL:async (...args) => { mails.push(args); return mailResult; },location:{assign:url=>destination=url,search:''}};
  const document = {querySelector:()=>null,querySelectorAll:()=>[],getElementById:id=>id === 'quoteForm' ? quote : null,addEventListener(){}};
  const ctx = {window,document,location:window.location,URLSearchParams,FormData:class {get(k){return quote.data[k] || '';} getAll(k){return quote.data[k] || [];}}};
  vm.runInNewContext(fs.readFileSync('corporate.js','utf8'),ctx);
  quote.data = {name:'Ana & João',role:'RH',function:'Gestão de pessoas',company:'Empresa A',region:'Recife / PE',email:'ana@empresa.com',services:['AEP / AET','Riscos psicossociais (NR-1)'],coupon:'EBOOK10',message:'Equipe de 20 pessoas'};
  return {quote,mails,submit:()=>quote.events.submit({preventDefault(){}}),destination:()=>destination};
}
let f = contact({whatsapp:'5511987654321',email:''});
await f.submit();
assert.equal(f.mails.length,0); assert.equal(f.destination(),undefined);
assert(f.quote.note.textContent.includes('não foram enviados'));
f = contact({whatsapp:'5511987654321',email:'contato@fite.com.br'});
await f.submit();
assert.equal(f.destination(),undefined,'Quote must not open WhatsApp');
assert.equal(f.mails.length,1);
const [to,fields] = f.mails[0];
assert.equal(to,'contato@fite.com.br');
assert.equal(fields._replyto,'ana@empresa.com');
for(const [key,value] of [['Nome','Ana & João'],['Função / área de atuação','Gestão de pessoas'],['Empresa','Empresa A'],['Cidade / estado','Recife / PE'],['Serviços','AEP / AET, Riscos psicossociais (NR-1)'],['Cupom','EBOOK10'],['Contexto','Equipe de 20 pessoas']]) assert.equal(fields[key],value);
assert(f.quote.wasReset); assert(f.quote.note.textContent.includes('Recebemos'));
f = contact({email:'contato@fite.com.br'},false);
await f.submit();
assert(!f.quote.wasReset); assert(f.quote.note.textContent.includes('Não foi possível'));
f = contact({email:'contato@fite.com.br'});
f.quote.data.services = []; await f.submit();
assert.equal(f.mails.length,0);
assert(f.quote.note.textContent.includes('Selecione'));
// Product (WhatsApp) and careers (e-mail with résumé + WhatsApp) handoffs, with fake transports.
async function submission(kind,{number='5511987654321',email='rh@fite.com.br',size=1000} = {}) {
  const nodes = new Map();
  const node = key => {
    if(!nodes.has(key)) nodes.set(key,{value:'',textContent:'',events:{},addEventListener(e,fn){this.events[e]=fn;},focus(){},reset(){},reportValidity(){return true;},showModal(){this.open=true;},querySelector:selector=>node(key+selector)});
    return nodes.get(key);
  };
  const formId = kind === 'careers' ? 'careersForm' : 'leadForm';
  const form = node(formId);
  let destination;
  const mails = [];
  const window = {FITE_CONFIG:{whatsapp:number,careersWhatsapp:number && '5521987654321',careersEmail:email},FITE_POST_EMAIL:async (...args) => { mails.push(args); return true; },location:{assign:url=>destination=url,search:''}};
  const resume = {name:'curriculo.pdf',size};
  const values = {name:'Maria',role:'Fisioterapeuta',function:'Ergonomia',company:'Empresa B',region:'João Pessoa / PB',email:'maria@example.com',phone:'(83) 98888-7777',interest:'Riscos psicossociais (NR-1)',experience:'Atuação em empresas',product:'AEP e AET na prática (FITE 02)',attachment:resume};
  vm.runInNewContext(fs.readFileSync('corporate.js','utf8'),{window,document:{activeElement:node('opener'),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},getElementById:id=>id === 'quoteForm' ? null : node(id)},location:window.location,URLSearchParams,FormData:class {get(key){return values[key] || '';}}});
  if(kind === 'product') {
    window.FITE_OPEN_LEAD(values.product);
    assert.equal(node('leadForm[name="product"]').value,values.product);
    assert.equal(node('leadDialog').open,true);
  }
  await form.events.submit({preventDefault(){}});
  return {destination,mails,resume,note:node(`${formId}.form-note`)};
}
let result = await submission('product');
let message = new URL(result.destination).searchParams.get('text');
for(const value of ['Maria','Fisioterapeuta','Ergonomia','Empresa B','João Pessoa / PB','AEP e AET na prática (FITE 02)']) assert(message.includes(value));
result = await submission('careers');
assert.equal(result.mails.length,1);
assert.equal(result.mails[0][0],'rh@fite.com.br');
assert.equal(result.mails[0][1]['Área de interesse'],'Riscos psicossociais (NR-1)');
assert.equal(result.mails[0][1]._replyto,'maria@example.com');
assert.equal(result.mails[0][2].length,1);
assert.equal(result.mails[0][2][0][0],'attachment');
assert.equal(result.mails[0][2][0][1],result.resume,'Résumé must be attached to the e-mail');
for(const value of ['Maria','Fisioterapeuta','(83) 98888-7777','Atuação em empresas']) assert(Object.values(result.mails[0][1]).includes(value));
assert.equal(result.destination,undefined,'Careers form goes by e-mail only (WhatsApp is the floating button)');
assert(result.note.textContent.includes('Recebemos'));
result = await submission('careers',{size:6 * 1024 * 1024});
assert.equal(result.mails.length,0); assert.equal(result.destination,undefined);
assert(result.note.textContent.includes('5 MB'));
result = await submission('careers',{email:''});
assert.equal(result.destination,undefined);
assert.equal(result.mails.length,0); assert(result.note.textContent.includes('não foram enviados'));
result = await submission('product',{number:''});
assert.equal(result.destination,undefined);
for(const file of ['index.html','produtos/index.html','ebooks/index.html']) {
  const page = fs.readFileSync(file,'utf8');
  for(const form of page.matchAll(/<form\b[\s\S]*?<\/form>/g)) assert.equal([...form[0].matchAll(/name="function"/g)].length,1,`Function duplicated or absent in ${file}`);
}
const home = fs.readFileSync('index.html','utf8');
for(const slug of ['ergonomia','ginastica-laboral','qualidade-de-vida','palestras-sipat','gestao-de-riscos','inclusao-retorno','exoesqueletos-inovacao','mentoria','riscos-psicossociais','quick-massage']) {
  assert(home.includes(`href="solucoes/${slug}/index.html"`),`Home missing link to solucoes/${slug}`);
  assert(fs.existsSync(`solucoes/${slug}/index.html`),`Missing solution page solucoes/${slug}`);
}
const library = fs.readFileSync('artigos/index.html','utf8');
assert.equal([...library.matchAll(/class="article-card"/g)].length,16);
assert.equal([...library.matchAll(/class="article-card__surface" href="https:\/\/beecorp\.com\.br\//g)].length,0,'No article should link out to BeeCorp');
for(const image of ['lkinkedin2.jpeg','linkedin3.jpeg']) assert(library.includes(`href="${image}"`));
for(const file of files) assert(!/beecorp/i.test(fs.readFileSync(file,'utf8')),`Unexpected BeeCorp mention in ${file}`);
for(const file of files.filter(f=>f!=='ebooks/index.html')) {
 const html=fs.readFileSync(file,'utf8');
 assert(!html.includes('href="ebooks/index.html"'));
 assert(html.includes('https://www.instagram.com/fite_consultoria/'));
 assert(html.includes('https://www.linkedin.com/company/fite-consultoria/'),`Missing LinkedIn in ${file}`);
 assert(html.includes('experience.js') && html.includes('site-config.js'),`Missing floating WhatsApp in ${file}`);
}
// Verify expand, collapse and cancellation without a browser or external requests.
const animations=[];
const summary={events:{},setAttribute(){},addEventListener(e,fn){this.events[e]=fn;},getBoundingClientRect:()=>({height:60})};
const details={dataset:{},style:{},open:false,querySelector:()=>summary,getBoundingClientRect(){return {height:this.open?320:60};},animate(frames,options){const animation={frames,options,cancel(){this.cancelled=true;}};animations.push(animation);return animation;}};
vm.runInNewContext(fs.readFileSync('experience.js','utf8'),{window:{matchMedia:()=>({matches:false})},document:{querySelectorAll:s=>s==='details'?[details]:[]}});
const click=()=>summary.events.click({preventDefault(){}});
click(); assert.equal(details.open,true); assert.equal(animations[0].frames[1].height,'320px'); animations[0].onfinish();
click(); assert.equal(animations[1].frames[1].height,'60px'); animations[1].onfinish(); assert.equal(details.open,false);
click(); click(); assert.equal(animations[2].cancelled,true); animations[3].onfinish(); assert.equal(details.open,false);
assert.equal(details.style.overflow,'');
console.log(`PASS: ${files.length} páginas, ${checked} referências locais, 10 soluções, 16 artigos publicados no domínio da FITE (0 links externos para BeeCorp); catálogo unificado com ebooks a R$ 55, proposta por e-mail com cupom, currículo anexado por e-mail, botão flutuante do WhatsApp, expansão/retração animada, Instagram e LinkedIn.`);
})().catch(error => { console.error(error); process.exit(1); });
