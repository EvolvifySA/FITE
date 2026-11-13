# Informações pendentes para concluir a publicação

- Configurar o WhatsApp oficial em `site-config.js` (55 + DDD + número). Nenhum formulário envia dados enquanto o número estiver vazio.
- `email` configurado como contato@fiteconsultoria.com.br em `site-config.js` (recebe propostas e currículos) e, se quiser outro destino para currículos, `careersEmail`. O envio usa o FormSubmit (formsubmit.co): no primeiro envio, o FormSubmit manda um e-mail de ativação para esse endereço; é preciso clicar no link de confirmação uma vez. Enquanto `email` estiver vazio, o formulário de proposta não envia nada.
- Definir os cupons entregues a quem comprou ebooks. O campo “Cupom de desconto” é livre e só repassa o código no e-mail da proposta; a validação é feita pela equipe.
- Configurar `schedulingUrl` com o link oficial da agenda. Sem ele, o botão solicita uma aula pelo WhatsApp, sem prometer um horário confirmado.
- Confirmar João Pessoa/PB, Recife/PE e Campina Grande/PB, regiões mantidas do site anterior, e informar outras regiões atendidas.
- Enviar nomes/logos autorizados das empresas parceiras. Empregadores anteriores de Helmar não foram apresentados como clientes da FITE.
- Enviar cases com cliente, contexto, solução, período e resultados aprovados. A seção “FITE na prática” usa as fotos fornecidas, sem atribuir números ou resultados.
- Confirmar o contato para currículos; `careersWhatsapp` permite um número dedicado, com fallback para o WhatsApp geral. O currículo (PDF/DOC/DOCX, até 5 MB) vai anexado por e-mail.
- Todos os 12 itens do catálogo (ebooks, checklists, planilhas, curso e mentoria) fixados em R$ 55, a pedido do cliente. Confirmar o curso "Ergonomia de Alta Performance" (antes R$ 897) e a "Mentoria em saúde do trabalhador" (antes R$ 2.490).
- Revisar o texto da nova solução “Riscos psicossociais e NR-1” (`solucoes/riscos-psicossociais/`), escrito sem números ou resultados.
- Confirmar títulos, valores, conteúdo e disponibilidade dos produtos preservados de `produtos-data.js`. A solicitação é comercial via WhatsApp, sem pagamento ou entrega automática.

Referências de organização (apenas para layout, sem vínculo de marca): https://beecorp.com.br/ e https://vitalwork.com.br/. O layout foi adaptado com conteúdo e imagens da FITE.

## Páginas e formulários implementados

- `artigos/index.html`: 13 artigos de autoria confirmada de Helmar Aquino, com o texto integral publicado em páginas próprias da FITE (sem link ou menção à BeeCorp), e 3 referências técnicas. O registro de notebooks de 2007 abre o print enviado, pois o texto integral não foi fornecido. Certificações do `lkinkedin2.jpeg` ficam em bloco próprio e não são tratadas como artigos.
- `ebooks/index.html`: redireciona para o catálogo único, preservando links antigos. A Vercel também recebe uma regra de redirecionamento.
- `produtos/index.html`: catálogo único de produtos e ebooks, incluindo materiais de apoio e mentoria. O botão abre diretamente o WhatsApp com “Tenho interesse nesse produto”, nome e valor; não exige formulário. O número oficial ainda precisa ser configurado. Retrato exibido integralmente, sem corte.
- `trabalhe-conosco/index.html`: nome, cargo, função, região, e-mail, WhatsApp, área de interesse, experiência e currículo anexado, enviados somente por e-mail (FormSubmit).
- Formulário “Vamos montar sua proposta?” (home): enviado somente por e-mail, com e-mail/WhatsApp do cliente e cupom opcional.
- Novas soluções “Quick massage” e “Riscos psicossociais e NR-1” (10 cards, 4 por linha, última linha centralizada). Fotos novas (geradas por IA, enviadas pelo cliente) em `assets/fotos/`: capa da home, foto “Sobre”, ginástica laboral, quick massage e NR-1. As fotos com placas de carro saíram do site.
- Botão flutuante do WhatsApp (canto inferior direito, em `experience.js`) em todas as páginas, com o número oficial (83) 99104-6450. Por isso os formulários de proposta e currículo vão só por e-mail.
- LinkedIn (https://www.linkedin.com/company/fite-consultoria/) no rodapé de todas as páginas.
- Home reorganizada a partir do HTML e CSS públicos da BeeCorp: abertura compacta, botões arredondados, diferenciais, desafios, soluções em quatro colunas e blocos de conteúdo.
- Fotos locais de `laboral/`, retratos de `assets/` e registros de `assets/eventos/` distribuídos pelas páginas.
- O `laboral/README.md` descreve as fotos, sem definir uma lista de módulos. As oito soluções existentes receberam seções individuais; confirmar se há outro documento de módulos.
- Contato redesenhado com grupos de campos e seleção por chips; participações e detalhes têm expansão/retração animada, respeitando preferência por movimento reduzido. Prints abrem em diálogo ampliado.
- Instagram informado pelo usuário: https://www.instagram.com/fite_consultoria/, incluído no contato e nos rodapés.
- Verificação funcional e de links: `node check-site.cjs`. A conferência visual em navegador permanece pendente porque não havia navegador disponível na sessão.
