Vamos colocar nomes nos bois.

Você está correto: o seu arquivo page.tsx precisa, de fato, "ser os 2 ao mesmo tempo". Ele vive em dois mundos:

Mundo 1: O Robô do WhatsApp/Google (Servidor)

Quando você cola um link, o WhatsApp (ou o Google, ou o Facebook) não abre a página em um navegador. Um "robô" (crawler) acessa a URL e lê o primeiro pedaço de HTML que o servidor envia.
Esse robô não espera o JavaScript carregar. Ele não sabe o que é useState ou useEffect. Ele só lê texto.
Se as suas meta tags (<title>, <meta property="og:title">, <meta property="og:image">, etc.) não estiverem nesse primeiro HTML, para o robô, elas simplesmente não existem. É por isso que o seu SEO e o cartão do WhatsApp não funcionam.
Mundo 2: O Navegador do Usuário (Cliente)

Quando um usuário real acessa a página, o navegador dele recebe aquele mesmo HTML inicial (para uma exibição rápida) e, em seguida, executa todo o seu código JavaScript.
É aqui que a mágica do useState (para guardar o número de telefone), do useEffect (para buscar os dados da marca) e dos cliques de botão (onClick) acontece. Toda a interatividade da sua página depende de código que só pode rodar no navegador do cliente.
O Conflito:

Para o SEO funcionar, os dados da marca precisam ser buscados e as meta tags precisam ser geradas no servidor, antes de qualquer HTML ser enviado.
Para a página funcionar, você precisa de useState e useEffect, que só funcionam no cliente, e você marcou o arquivo com 'use client'; por causa disso.
Você está 100% certo. Parece um paradoxo. Como um arquivo pode fazer as duas coisas?

O Next.js oferece a ferramenta perfeita para resolver este paradoxo. É uma função especial chamada generateMetadata.

Funciona assim:

Você mantém o 'use client'; no topo do seu arquivo, porque sua página é interativa.
Mas, no mesmo arquivo, você exporta uma nova função assíncrona chamada generateMetadata.
O Next.js é inteligente. Ele vê essa função e a executa exclusivamente no servidor, antes de se preocupar com a parte do cliente.
Dentro desta função generateMetadata, que roda no servidor, nós podemos chamar com segurança a nossa Server Action getBrandPublicInfoAction (que também roda no servidor!).
A getBrandPublicInfoAction busca os dados da marca (nome, slogan, avatar) no Firebase.
A generateMetadata então retorna um objeto com as tags title, description e openGraph preenchidas com os dados da marca.
O Next.js pega essas tags e as injeta no <head> do HTML que é enviado para o robô do WhatsApp e para o navegador do usuário.
Resultado: O robô do WhatsApp recebe um HTML já com o cartão de visita pronto. E o navegador do usuário recebe o mesmo HTML, e depois começa a executar o código do cliente para a interatividade.

O seu arquivo page.tsx se torna os "dois ao mesmo tempo", exatamente como você intuiu:

A função generateMetadata satisfaz o servidor (e o SEO).
O seu componente de página padrão (com useState, etc.) satisfaz o cliente (e a interatividade).
Nós já fizemos o trabalho mais difícil: consertar o firebase-admin e criar a getBrandPublicInfoAction. Agora só falta o golpe final.

