const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = process.cwd();
const files = ['index.html','produtos/index.html','ebooks/index.html','artigos/index.html','trabalhe-conosco/index.html','nr-17/index.html','psicossociais/index.html','ergonomia-no-trabalho/index.html','impacto-da-usabilidade/index.html','analise-da-confiabilidade/index.html','o-que-e-ergonomia/index.html','seguranca-do-trabalho/index.html','cat/index.html','apr/index.html','gro/index.html','pcmso/index.html','sesmt/index.html','rat/index.html','pgr/index.html','riscos-ergonomicos/index.html','solucoes/ergonomia/index.html','solucoes/ginastica-laboral/index.html','solucoes/qualidade-de-vida/index.html','solucoes/palestras-sipat/index.html','solucoes/gestao-de-riscos/index.html','solucoes/inclusao-retorno/index.html','solucoes/exoesqueletos-inovacao/index.html','solucoes/mentoria/index.html'];
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
function catalog(category,search='',lockedCategory,whatsapp='5511987654321') {
  const elements = new Map();
  const el = id => { if(!elements.has(id)) elements.set(id,{innerHTML:'',textContent:'',events:{},addEventListener(e,fn){this.events[e]=fn;},focus(){}}); return elements.get(id); };
  el('productGrid').dataset = {category:lockedCategory};
  let selected,destination;
  vm.runInNewContext(fs.readFileSync('products.js','utf8'),{window:{...data,FITE_WHATSAPP_URL:contact({whatsapp}).window.FITE_WHATSAPP_URL,location:{assign:url=>{destination=url;selected=new URL(url).searchParams.get('text');}}},document:{getElementById:el,querySelector:el},location:{search:`?categoria=${category}`},URLSearchParams,Intl});
  if(search) el('productSearch').events.input({target:{value:search}});
  return {el,selected:()=>selected,destination:()=>destination};
}
let c = catalog('EBOOK');
assert.equal(c.el('productCount').textContent,'4 produtos encontrados');
c.el('productGrid').events.click({target:{closest:()=>({dataset:{product:'fite-02'}})}});
assert(c.selected().includes('AEP e AET'));
assert(c.selected().includes('Tenho interesse nesse produto:'));
assert(/Valor: R\$\s97,00/.test(c.selected()));
assert.equal(new URL(c.destination()).hostname,'wa.me');
c = catalog('EBOOK');
c.el('productGrid').events.click({target:{closest:()=>({dataset:{product:'fite-01'}})}});
assert(/Valor: R\$\s0,00 \(gratuito\)/.test(c.selected()));
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
function contact(config) {
  const quote = {events:{},note:{},checked:[],reportValidity:()=>true,querySelector:s=>s === '.form-note' ? quote.note : {focus(){}},querySelectorAll:()=>quote.checked,addEventListener(e,fn){this.events[e]=fn;}};
  let destination;
  const window = {FITE_CONFIG:config,location:{assign:url=>destination=url,search:''}};
  const document = {querySelector:()=>null,querySelectorAll:()=>[],getElementById:id=>id === 'quoteForm' ? quote : null,addEventListener(){}};
  const ctx = {window,document,location:window.location,URLSearchParams,FormData:class {get(k){return quote.data[k] || '';} getAll(k){return quote.data[k] || [];}}};
  vm.runInNewContext(fs.readFileSync('corporate.js','utf8'),ctx);
  quote.data = {name:'Ana & João',role:'RH',function:'Gestão de pessoas',company:'Empresa A',region:'Recife / PE',services:['AEP / AET','Ginástica laboral'],message:'Equipe de 20 pessoas'};
  return {window,quote,submit:()=>quote.events.submit({preventDefault(){}}),destination:()=>destination};
}
let f = contact({whatsapp:''});
f.submit();
assert.equal(f.destination(),undefined);
assert(f.quote.note.textContent.includes('não foram enviados'));
f = contact({whatsapp:'5583999999999'});
f.submit(); assert.equal(f.destination(),undefined);
f = contact({whatsapp:'5511987654321'});
f.submit();
const sent = new URL(f.destination());
assert.equal(sent.hostname,'wa.me');
for(const value of ['Ana & João','Gestão de pessoas','Empresa A','Recife / PE','AEP / AET, Ginástica laboral']) assert(sent.searchParams.get('text').includes(value));
f = contact({whatsapp:'5511987654321'});
f.quote.data.services = []; f.submit();
assert.equal(f.destination(),undefined);
assert(f.quote.note.textContent.includes('Selecione'));
// Exercise product and careers handoffs without contacting WhatsApp.
function submission(kind,number='5511987654321') {
  const nodes = new Map();
  const node = key => {
    if(!nodes.has(key)) nodes.set(key,{value:'',textContent:'',events:{},addEventListener(e,fn){this.events[e]=fn;},focus(){},reset(){},reportValidity(){return true;},showModal(){this.open=true;},querySelector:selector=>node(key+selector)});
    return nodes.get(key);
  };
  const form = node(kind === 'careers' ? 'careersForm' : 'leadForm');
  let destination;
  const window = {FITE_CONFIG:{whatsapp:number,careersWhatsapp:'5521987654321'},location:{assign:url=>destination=url,search:''}};
  const values = {name:'Maria',role:'Fisioterapeuta',function:'Ergonomia',company:'Empresa B',region:'João Pessoa / PB',contact:'maria@example.com',interest:'Ergonomia',experience:'Atuação em empresas',product:'AEP e AET na prática (FITE 02)'};
  vm.runInNewContext(fs.readFileSync('corporate.js','utf8'),{window,document:{activeElement:node('opener'),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},getElementById:id=>id === 'quoteForm' ? null : node(id)},location:window.location,URLSearchParams,FormData:class {get(key){return values[key] || '';}}});
  if(kind === 'product') {
    window.FITE_OPEN_LEAD(values.product);
    assert.equal(node('leadForm[name="product"]').value,values.product);
    assert.equal(node('leadDialog').open,true);
  }
  form.events.submit({preventDefault(){}});
  return {destination,nodes};
}
let result = submission('product');
let message = new URL(result.destination).searchParams.get('text');
for(const value of ['Maria','Fisioterapeuta','Ergonomia','Empresa B','João Pessoa / PB','AEP e AET na prática (FITE 02)']) assert(message.includes(value));
result = submission('careers');
assert.equal(new URL(result.destination).pathname,'/5521987654321');
message = new URL(result.destination).searchParams.get('text');
for(const value of ['Maria','Fisioterapeuta','Ergonomia','maria@example.com','Atuação em empresas']) assert(message.includes(value));
result = submission('product','');
assert.equal(result.destination,undefined);
for(const file of ['index.html','produtos/index.html','ebooks/index.html']) {
  const page = fs.readFileSync(file,'utf8');
  for(const form of page.matchAll(/<form\b[\s\S]*?<\/form>/g)) assert.equal([...form[0].matchAll(/name="function"/g)].length,1,`Function duplicated or absent in ${file}`);
}
const home = fs.readFileSync('index.html','utf8');
for(const slug of ['ergonomia','ginastica-laboral','qualidade-de-vida','palestras-sipat','gestao-de-riscos','inclusao-retorno','exoesqueletos-inovacao','mentoria']) {
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
console.log(`PASS: ${files.length} páginas, ${checked} referências locais, 8 soluções, 16 artigos publicados no domínio da FITE (0 links externos para BeeCorp); catálogo unificado, WhatsApp com nome e valor, expansão/retração animada e Instagram.`);
