# Informações pendentes para concluir a publicação

- Configurar o WhatsApp oficial em `site-config.js` (55 + DDD + número). Nenhum formulário envia dados enquanto o número estiver vazio.
- Configurar `schedulingUrl` com o link oficial da agenda. Sem ele, o botão solicita uma aula pelo WhatsApp, sem prometer um horário confirmado.
- Confirmar João Pessoa/PB, Recife/PE e Campina Grande/PB, regiões mantidas do site anterior, e informar outras regiões atendidas.
- Enviar nomes/logos autorizados das empresas parceiras. Empregadores anteriores de Helmar não foram apresentados como clientes da FITE.
- Enviar cases com cliente, contexto, solução, período e resultados aprovados. A seção “FITE na prática” usa as fotos fornecidas, sem atribuir números ou resultados.
- Confirmar o contato para currículos; `careersWhatsapp` permite um número dedicado, com fallback para o WhatsApp geral.
- Confirmar títulos, valores, conteúdo e disponibilidade dos produtos preservados de `produtos-data.js`. A solicitação é comercial via WhatsApp, sem pagamento ou entrega automática.

Referências de organização (apenas para layout, sem vínculo de marca): https://beecorp.com.br/ e https://vitalwork.com.br/. O layout foi adaptado com conteúdo e imagens da FITE.

## Páginas e formulários implementados

- `artigos/index.html`: 13 artigos de autoria confirmada de Helmar Aquino, com o texto integral publicado em páginas próprias da FITE (sem link ou menção à BeeCorp), e 3 referências técnicas. O registro de notebooks de 2007 abre o print enviado, pois o texto integral não foi fornecido. Certificações do `lkinkedin2.jpeg` ficam em bloco próprio e não são tratadas como artigos.
- `ebooks/index.html`: redireciona para o catálogo único, preservando links antigos. A Vercel também recebe uma regra de redirecionamento.
- `produtos/index.html`: catálogo único de produtos e ebooks, incluindo materiais de apoio e mentoria. O botão abre diretamente o WhatsApp com “Tenho interesse nesse produto”, nome e valor; não exige formulário. O número oficial ainda precisa ser configurado. Retrato exibido integralmente, sem corte.
- `trabalhe-conosco/index.html`: nome, cargo, função, região, contato, área de interesse e experiência enviados ao contato de recrutamento configurado.
- Home reorganizada a partir do HTML e CSS públicos da BeeCorp: abertura compacta, botões arredondados, diferenciais, desafios, soluções em quatro colunas e blocos de conteúdo.
- Fotos locais de `laboral/`, retratos de `assets/` e registros de `assets/eventos/` distribuídos pelas páginas.
- O `laboral/README.md` descreve as fotos, sem definir uma lista de módulos. As oito soluções existentes receberam seções individuais; confirmar se há outro documento de módulos.
- Contato redesenhado com grupos de campos e seleção por chips; participações e detalhes têm expansão/retração animada, respeitando preferência por movimento reduzido. Prints abrem em diálogo ampliado.
- Instagram informado pelo usuário: https://www.instagram.com/fite_consultoria/, incluído no contato e nos rodapés.
- Verificação funcional e de links: `node check-site.cjs`. A conferência visual em navegador permanece pendente porque não havia navegador disponível na sessão.
