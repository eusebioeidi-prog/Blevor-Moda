# BLEVOR na Netlify: passo a passo

## O que vem neste pacote
- `public/index.html` : a loja e o painel de administrador.
- `netlify/functions/api.mjs` : o pequeno serviço que guarda os produtos, as fotos e valida a palavra-passe no servidor.
- `package.json` e `netlify.toml` : configuração para a Netlify instalar tudo sozinha.

Como funciona: os produtos e as fotos ficam guardados na própria Netlify (Netlify Blobs), por isso aparecem a todos os visitantes. A palavra-passe do painel deixa de estar escrita na página e passa a ser verificada no servidor.

IMPORTANTE: arrastar a pasta para o "Netlify Drop" NÃO instala o serviço (as funções não são publicadas). Use o Método 1 (GitHub) ou o Método 2 (terminal).

---

## Método 1 (recomendado): GitHub + Netlify, só no navegador

### Parte A: pôr os ficheiros no GitHub
1. Crie uma conta em https://github.com (grátis).
2. Clique em "New repository". Nome: `blevor`. Deixe "Private" se quiser. Clique em "Create repository".
3. Na página do repositório, clique em "uploading an existing file" (ou Add file > Upload files).
4. Descomprima o zip. Abra a pasta e arraste para o GitHub TUDO o que está dentro: as pastas `public` e `netlify` e os ficheiros `package.json`, `netlify.toml` (e este guia, se quiser).
5. Aguarde o envio terminar e clique em "Commit changes".
6. Confirme no GitHub que existem `public/index.html` e `netlify/functions/api.mjs` (as pastas têm de manter esses nomes).

### Parte B: ligar à Netlify
1. Crie uma conta em https://app.netlify.com (pode entrar com a conta do GitHub).
2. Clique em "Add new project" > "Import an existing project" > "Deploy with GitHub". Autorize e escolha o repositório `blevor`.
3. Na configuração, não precisa de mudar nada: a Netlify lê o `netlify.toml` (publish: `public`, functions: `netlify/functions`). Clique em "Deploy".
4. Espere o deploy ficar "Published". A Netlify dá um endereço do tipo `nome-aleatorio.netlify.app`.

### Parte C: definir a sua palavra-passe (importante)
1. No projeto, abra Project configuration > Environment variables > Add a variable.
2. Chave: `ADMIN_PASSWORD`   Valor: a palavra-passe que quer (ex.: 505020@, ou melhor, uma nova e mais forte).
3. Grave e vá a Deploys > Trigger deploy > Deploy site, para a variável ser aplicada.
Se não definir a variável, o sistema usa 505020@.

### Parte D: testar tudo
1. Abra o endereço da Netlify: a loja deve abrir, com a mensagem "Nenhum produto disponível de momento".
2. Abra `o-seu-endereço/#admin`, entre com a palavra-passe e veja a mensagem "Guardado.".
3. Adicione um produto com foto. Deve aparecer "A guardar..." e depois "Guardado.".
4. Abra a loja noutro navegador ou no telemóvel (sem sessão): o produto tem de aparecer.
5. Clique em "Comprar no WhatsApp": deve abrir a conversa com o 974 159 104 e o nome e preço do produto.
6. Clique nos ícones do Instagram, Facebook e TikTok e confirme as páginas.
7. Teste os botões do carrossel, os filtros de categoria, a pesquisa e a opção "Nova categoria" no formulário.
8. Teste no telemóvel e no computador.

### Para alterar a loja depois
- Produtos, categorias e número de WhatsApp: pelo painel (#admin). Fica logo online, sem novo deploy.
- Alterar o design ou textos: edite `public/index.html` no GitHub (lápis > Commit). A Netlify republica sozinha.

---

## Método 2: terminal (alternativa)
1. Instale o Node.js (https://nodejs.org).
2. Dentro da pasta do pacote: `npm install`, depois `npm install -g netlify-cli`.
3. `netlify login`, `netlify init` (ou `netlify link`) e por fim `netlify deploy --prod`.
4. Defina `ADMIN_PASSWORD` no painel da Netlify, como na Parte C.

---

## Domínio próprio (ex.: blevor.ao ou blevor.com)
1. Compre o domínio. Para .com: Namecheap, Porkbun ou GoDaddy. Para .ao, a DNS.AO tem requisitos próprios: confirme no site deles.
2. Na Netlify: Domain management > Add a domain > escreva o domínio.
3. A Netlify indica os registos DNS (ou os servidores de nomes). Crie-os no painel do registador.
4. Aguarde a propagação (minutos a 48 horas). O HTTPS é ativado automaticamente. Depois, defina o domínio como principal.

---

## Notas importantes
- Segurança: a palavra-passe é verificada no servidor, mas não há bloqueio contra muitas tentativas. Use uma palavra-passe forte e não a partilhe.
- Fotos: o painel reduz cada foto para cerca de 700 px antes de enviar. Fotos apagadas ou substituídas são removidas do armazenamento.
- Limites: o plano gratuito da Netlify tem limites mensais de uso, mais do que suficientes para começar. Consulte a página de preços deles.
- Cópia de segurança: os dados vivem na Netlify (Blobs). Se mudar de hospedagem, é preciso exportá-los; peça ajuda antes de apagar o projeto.
- Os nomes dos menus da Netlify podem mudar ligeiramente com o tempo.

## Se algo falhar
- "Palavra-passe incorreta ou serviço indisponível": veja em Deploys > Functions se a função `api` existe. Se não existir, a pasta `netlify/functions` não foi enviada para o GitHub ou o deploy foi feito por arrastar e largar.
- "Falha ao guardar": abra Deploys > Functions > api > Logs e veja a mensagem de erro.
- Produtos não aparecem noutro aparelho: confirme que guardou no painel (mensagem "Guardado.") e atualize a página.
- Erro a instalar dependências no deploy: confirme que `package.json` está na raiz do repositório.
