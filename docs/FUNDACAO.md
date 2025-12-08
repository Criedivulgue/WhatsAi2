WhatsAi - Aplicação de Gerenciamento de Contatos Inteligente
Documento Completo — Arquitetura Geral do Aplicativo
Por gentileza, crie uma aplicação Web completa e preparada para dados reais funcionais, mesmo que inicialmente mokados, considerando o projeto firebase com o plano Blazer.
WhatsAi - Uma aplicação web moderna, responsiva e visualmente consistente em tons de verde e verde-escuro.  Desenvolvida com Next.js (frontend) e Firebase (backend — Hosting, Firestore, Functions, Auth, Storage, Messaging), a plataforma oferece gerenciamento avançado de contatos, ferramentas de comunicação integradas e um sofisticado módulo de IA personalizada.

1. Fluxo de Registro e Onboarding
O Atendente se registra e realiza um Onboarding obrigatório, onde fornece informações essenciais para a configuração inicial da sua conta e geração do seu link exclusivo de Chat de Cliente.
Durante o Onboarding são coletados:
Nome da Marca


Slogan


Avatar (imagem usada no Open Graph e no Chat)


Dados de contato básicos


Configurações iniciais da IA (texto-base, tom, fonte de conhecimento)


Essas informações são usadas para gerar corretamente as Meta Tags Open Graph, essenciais para garantir que, ao compartilhar o link pelo WhatsApp ou redes sociais, apareça um cartão digital elegante e clicável, contendo:
Título da marca


Slogan


Avatar


Essa pré-visualização aumenta a credibilidade e a taxa de cliques.

2. Interface Principal do Atendente
Após o cadastro, o Atendente é levado à sua área interna, onde visualiza:
Contatos que já iniciaram conversas via Chat


Contatos importados manualmente


Cada contato é exibido em um Card, contendo:
Foto do cliente (ou imagem padrão)


Nome / Marca do cliente


WhatsApp (copiável)


E-mail (clicável para abrir o Gmail com mensagem pré-preenchida)


Ícone do Google Calendar (abre a criação de evento personalizado)


Ícones de Editar / Excluir


Seletor Liga / Desliga (controle extra de disponibilidade ou preferência)


Acesso ao Chat
Ao clicar na imagem do cliente, o Atendente abre somente o chat daquele cliente, mantendo o foco e evitando mistura de conversas.

3. Edição de Contatos
A edição é rápida e intuitiva.
 Um painel lateral desliza da direita mostrando os seguintes campos:
Nome / Marca


E-mail


WhatsApp


Interesses


Tipo de Contato


Os campos “Interesses” e “Tipos” são totalmente configuráveis pelo Atendente na área de Configurações.

4. Área de Configurações do Atendente
A página de configurações é dedicada e contém:
Ajustes da IA de atendimento


Área de Upload da Fonte de Conhecimento (descrição da marca, documentos, textos)


Criação de itens personalizados para:


Tipos


Interesses


Informações do perfil e marca:


Nome da Marca


Descrição


Avatar


Dados do Atendente


Parâmetros gerais da conta


Essa área garante total personalização e refinamento contínuo.

5. Chat de Cliente (PWA)
O Chat de Cliente é um PWA que pode ser instalado no dispositivo do cliente e funciona tanto online quanto em cenários offline leves.
Sempre que o link é compartilhado, as Meta Tags OG exibem:
Avatar do Atendente


Nome da Marca


Descrição da Marca


Fluxo do Cliente
Cliente acessa o link


Informa seu número de telefone (auto-formatado)


Entrada no chat


Atendimento automático inicial pela IA personalizada


Enquanto isso, o Atendente recebe uma notificação via push offline no sininho da plataforma.

6. Área de Atendimentos (Chats)
A área de atendimento exibe todos os chats em andamento ou finalizados.
 No topo há:
Campo de Filtro Global, pesquisando por:


nome


telefone


e-mail


tipo


interesses


Botão IMPORTAR contatos


Botão EXPORTAR contatos selecionados


Botão de Configurações


Avatar do Atendente


O Atendente pode monitorar em tempo real:
mensagens sendo trocadas


ações da IA


status do cliente


Também pode, a qualquer momento:
editar contato


excluir contato


ativar ou desativar a IA imediatamente



7. Uso Inteligente de IA (Memória, Contexto e Automação)
(Seção integrada)
A IA é altamente personalizada e atua como um assistente inteligente, capaz de aprender, resumir e evoluir junto com o relacionamento entre Atendente e cliente.
7.1. Memória Persistente por Cliente
Ao término de cada chat, a IA gera automaticamente um Resumo Estruturado que é salvo no Firestore.
 Esse resumo contém:
tópicos centrais da conversa


necessidades do cliente


preferências e interesses


ações solicitadas


sentimento detectado (opcional / configurável)


sugestões de próximos passos


Essa memória serve como base para atendimentos futuros.

7.2. Continuidade e Contexto em Novos Atendimentos
Quando o cliente retorna:
a IA consulta todo o histórico condensado


adapta suas respostas com base nas memórias anteriores


evita que o cliente repita informações


garante coerência, empatia e continuidade


Isso torna o atendimento mais humano e eficiente.

7.3. Enriquecimento Automático do Perfil do Contato
Com base no conteúdo da conversa, a IA pode sugerir:
novos interesses


ajustes de categoria/tipo


insights sobre oportunidades


notas internas a serem adicionadas


O Atendente pode aprovar ou ignorar essas sugestões.

7.4. Follow-Ups Inteligentes
A IA gera automaticamente:
sugestões de follow-up


rascunhos de e-mail personalizados


mensagens prontas para WhatsApp


pré-criação de eventos no Google Calendar


Tudo disponível para envio com 1 clique pelo Atendente.

7.5. Painel de Insights e Análises (expansão futura)
A plataforma pode incluir futuramente análises avançadas:
volume de conversas


tópicos mais recorrentes


clientes mais engajados


sentimentos predominantes


oportunidades detectadas



7.6. Personalização Profunda da IA
O Atendente pode ajustar:
tom de voz (formal, amigável, consultivo, minimalista, técnico)


regras que a IA deve seguir


informações proibidas


respostas prioritárias


fontes internas de conhecimento disponíveis à IA


A IA sempre respeita essas instruções.

7.7. Modo Assistente do Atendente
Durante conversas ativas, o Atendente pode ativar o Modo Assistente, onde a IA:
sugere respostas


cria mini-resumos instantâneos


propõe ações práticas (criar evento, enviar e-mail, marcar follow-up)


automatiza trechos repetitivos


O Atendente mantém controle total sobre tudo.

8. Arquitetura Técnica Resumida
Frontend:
Next.js


PWA para Chat


UI responsiva em tons de verde


Server Components + Client Components estratégicos


Backend (Firebase):
Hosting (Frontend + PWA do Chat)


Firestore (contatos, chats, memórias da IA, configurações)


Functions (automação, API Gmail/Calendar, geração de resumos da IA, regras da IA)


Firebase Auth (login e onboarding)


Storage (avatares e imagens)


Messaging (push notifications)



9. Benefícios-Chave da Plataforma
Atendimento altamente profissional


IA evolutiva com memória real de cada cliente


Contatos centralizados, organizados e enriquecidos


Ferramentas de produtividade integradas (Gmail, Calendar)


Personalização profunda


Experiência premium tanto para Atendente quanto para Cliente

ARQUITETURA TÉCNICA MODULAR — ESTRUTURAÇÃO LÓGICA E INCREMENTAL
A aplicação será construída em camadas e módulos isolados, mas integrados de maneira progressiva.
 Cada módulo pode ser gerado, testado e integrado de forma independente, permitindo que a IA de desenvolvimento construa a aplicação do zero com segurança, evitando retrabalho.

🔷 MÓDULO 1 — Fundamentos e Infraestrutura do Projeto
1.1. Estrutura Base do Projeto
Tecnologias:
Next.js (App Router)


TypeScript


TailwindCSS


Firebase SDK (modular)


Itens essenciais:
Estrutura /app organizada por rotas


Componentes reutilizáveis em /components


Hooks e serviços em /lib


Variáveis de ambiente carregadas via .env.local


1.2. Firebase Core
Configuração inicial do Firebase:
Firebase Auth


Firestore


Storage


Cloud Functions


Firebase Hosting


Messaging (push)


Administração via Firebase Admin SDK


Resultado:
 Base do app pronta para permitir tudo o que vem a seguir.

🔷 MÓDULO 2 — Sistema de Usuário (Atendente)
2.1. Autenticação
Registro via e-mail/senha


Login


Proteção de rotas


Recuperação de senha


2.2. Onboarding Estruturado
Fluxo obrigatório com:
Nome da marca


Slogan


Avatar


Configuração inicial da IA


Termo de uso aceito


Integração opcional com Google Account (para Gmail/Calendar)


Armazenado em /users/{userId}
2.3. Open Graph Autorregenerado
A aplicação gera automaticamente:
title


description


image
 com base no onboarding.


Inclui:
// METADATA
export const metadata = {
  openGraph: {
    title: ...,
    description: ...,
    images: [...]
  }
}


🔷 MÓDULO 3 — Sistema de Configurações do Atendente
Página dedicada em /settings com submódulos:
3.1. Configurações da IA
Armazena:
Personalidade


Tom de voz


Regras


Fontes de conhecimento


Prompt base


Acessos da IA (ocultos ao cliente)


3.2. Configurações de Marca
nome da marca


descrição


slogan


avatar


cores temáticas


3.3. Campos Personalizáveis
Coleções:
/types


/interests


Esses itens povoam menus no cadastro/edição de contatos.

🔷 MÓDULO 4 — Sistema de Contatos
Coleção: /users/{userId}/contacts/{contactId}
4.1. Estrutura técnica do contato
Cada contato contém:
nome


email


whatsapp


interesses: string[]


tipo: string


criação/atualização


metadados da IA:


histórico condensado


últimas ações sugeridas


pontuações de engajamento (futuro)


4.2. Interface de Listagem
Cards com informações principais


Página reativa com server-side e caching


Filtro global com busca composta


Seleção múltipla para importar/exportar


4.3. Painel Lateral de Edição
Formulário em slide-over


Validações


Atualizações em tempo real



🔷 MÓDULO 5 — Chat de Cliente (PWA)
Rota dinâmica:
 /c/{publicChatId}
5.1. Autenticação do Cliente
Não usa Auth.
 Fluxo simples:
Cliente insere telefone


Geramos token de sessão de curta duração


Criamos documento:
 /users/{attendantId}/clients/{clientId}


5.2. Estrutura do PWA
manifest.json


service-worker.js


offline fallback


instalação opcional no dispositivo


5.3. Chat Realtime
Websocket via Firestore listener


Mensagens gravadas em:
 /users/{attendantId}/chats/{chatId}/messages/{msg}


Mensagens não podem se misturar entre clientes.
5.4. Atendimento inicial pela IA
Assim que o cliente entra:
IA recebe evento via Cloud Function


IA responde automaticamente


Atendente recebe push



🔷 MÓDULO 6 — IA Inteligente com Memória
Este módulo é crucial — integra profundamente com todos os anteriores.
6.1. Memória Persistente
Após cada atendimento:
Função Cloud coleta mensagens


Gera resumo


Armazena em:
 /users/{attendantId}/contacts/{contactId}/memory


O resumo contém:
tópicos centrais


necessidades


interesses detectados


ações futuras


humor/sentimento (se ativado)


6.2. Uso da Memória no Novo Atendimento
Ao iniciar novo chat:
Função busca histórico condensado


Injeta memória no prompt da IA


IA assume contexto contínuo


Evita perguntas repetidas para o cliente


6.3. Enriquecimento Automático
IA detecta:
novos interesses


mudanças de categoria


oportunidade de follow-up


assuntos importantes


Registra sugestões em:
 /contacts/{id}/ai_suggestions/{}
6.4. Geração de Follow-Ups
IA cria:
e-mails prontos


mensagens WhatsApp


eventos Google Calendar


lembretes automáticos



🔷 MÓDULO 7 — Área de Atendimento do Atendente
Página: /chats
Exibe:
Lista dos chats ativos


Indicações visuais de quem está online


Status da IA


7.1. Chat do Atendente
Ao abrir um chat:
Visualização dos dois lados (cliente e IA)


Botão Ligar / Desligar IA


Acesso rápido ao contato


Mini-resumo instantâneo gerado pela IA


Sugestões inteligentes durante a conversa



🔷 MÓDULO 8 — Integrações Externas
Essas integrações permitem automações reais.
8.1. Gmail API
Envio de e-mails pré-preenchidos


Templates de follow-up


Notificações internas


8.2. Google Calendar
Criação de eventos a partir do Card do contato


Eventos gerados pela IA


Lembretes opcionais


8.3. Push Notifications
Notificações de novo cliente no chat


IA usando cloud messaging


Notificações offline



🔷 MÓDULO 9 — Infraestrutura e Segurança
9.1. Firestore Rules
Controle de acesso por Atendente


Chat isolado por cliente


Validação da origem


Prevenção de sobrescrita entre atendentes


9.2. Cloud Functions Responsáveis
gerarResumoIA()


atendimentoInicialIA()


gerarFollowUps()


validarNovoCliente()


atualizarPerfilComSugestoesIA()



🔷 MÓDULO 10 — Deploy, Build e CI/CD
10.1. Deploy no Firebase Hosting
/app → frontend principal


/c/** → Chat PWA


Cloud Functions → backend inteligente


10.2. Otimização Next.js
RSC


Cache agressivo


SWC otimizado


10.3. Pipeline (opcional)
Testes automáticos


Deploy automático on push


Validação de regras antes do deploy



🧩 FLUXO DE CONSTRUÇÃO INCREMENTAL RECOMENDADO PARA A IA DE DESENVOLVIMENTO
FASE 1 — Fundamentos
Criar projeto Next.js


Configurar Firebase


Criar sistema de Auth


Criar UI base


FASE 2 — Usuário (Atendente)
Login


Onboarding


Configurações iniciais


FASE 3 — Contatos
CRUD


Interface de listagem


Editor lateral


FASE 4 — Chat PWA
PWA básico


Autenticação leve do cliente


Chat realtime


Push notifications


FASE 5 — IA Inteligente
IA inicial no atendimento


Memória


Resumos automáticos


Follow-ups


Enriquecimento automático


FASE 6 — Integrações
Gmail


Calendar


Insights


FASE 7 — Refinamento e Automação
Modo Assistente


Sugestões inteligentes


Painéis de análise


10 INSTRUÇÕES DE IA PARA CONFERÊNCIA DOS MÓDULOS

1. Verificação do Módulo 1 — Fundamentos e Infraestrutura
Instrução:
 “Confirme se o projeto contém toda a infraestrutura base necessária: estrutura de pastas Next.js (App Router), configuração do Firebase SDK modular, serviços em /lib, componentes reutilizáveis, variáveis .env carregadas corretamente e inicialização dos módulos Firebase (Auth, Firestore, Storage, Functions, Hosting e Messaging). Verifique também se não há imports antigos do Firebase compat.”

2. Verificação do Módulo 2 — Sistema de Usuário (Atendente)
Instrução:
 “Valide se o fluxo de registro/login está funcional, se as rotas protegidas exigem autenticação e se o Onboarding obrigatório salva corretamente nome da marca, slogan, avatar e configurações iniciais da IA em /users/{userId}. Confirme também a geração automática das Meta Tags Open Graph conforme dados do Onboarding.”

3. Verificação do Módulo 3 — Configurações do Atendente
Instrução:
 “Analise se a página /settings possui todos os submódulos: Configurações da IA, Configurações da Marca e Campos Personalizáveis (types e interests). Verifique se todas as alterações são persistidas no Firestore, se os valores são reaplicados corretamente na UI e se os dados alimentam menus dinâmicos nos contatos.”

4. Verificação do Módulo 4 — Sistema de Contatos
Instrução:
 “Confira se a coleção /users/{userId}/contacts está sendo criada corretamente com os campos definidos (nome, email, whatsapp, tipo, interesses, metadados da IA). Valide a listagem, filtros globais, seleção múltipla, e o painel lateral de edição com atualizações em tempo real.”

5. Verificação do Módulo 5 — Chat de Cliente (PWA)
Instrução:
 “Certifique-se de que o PWA está configurado corretamente (manifest, service worker, offline fallback) e de que o fluxo do cliente funciona: entrada por telefone, criação de sessão temporária e vínculo ao atendente. Valide se o chat é realtime, se mensagens são isoladas por cliente e se o atendimento inicial da IA é acionado via Cloud Function.”

6. Verificação do Módulo 6 — IA Inteligente com Memória
Instrução:
 “Analise se as Cloud Functions geram resumos estruturados ao final de cada atendimento, armazenando-os na memória persistente por cliente. Verifique se, ao iniciar um novo chat, a IA recupera corretamente a memória condensada, aplica contexto contínuo e respeita personalizações do atendente.”

7. Verificação do Módulo 7 — Área de Atendimento do Atendente
Instrução:
 “Valide se a página /chats exibe todos os atendimentos, mostra status em tempo real e permite abrir chats individuais sem mistura entre clientes. Confira se o botão IA ON/OFF funciona, se mini-resumos instantâneos estão aparecendo e se a IA fornece sugestões responsivas durante a conversa.”

8. Verificação do Módulo 8 — Integrações Externas
Instrução:
 “Teste se a integração com Gmail API permite envio de e-mails pré-preenchidos e se o Google Calendar gera eventos tanto manualmente quanto via sugestões da IA. Verifique também se Firebase Messaging entrega notificações push corretamente, incluindo cenários offline.”

9. Verificação do Módulo 9 — Infraestrutura e Segurança
Instrução:
 “Analise as Firestore Rules garantindo isolamento completo por atendente, bloqueio de acessos cruzados, proteção dos dados do cliente e segurança no chat do PWA. Confirme se todas as Cloud Functions críticas (resumos, follow-ups, validação de cliente, IA inicial) possuem logs, validações de input e configurações adequadas.”

10. Verificação do Módulo 10 — Deploy, Build e CI/CD
Instrução:
 “Confirme se o deploy no Firebase Hosting está segmentado corretamente entre o app principal e o PWA (/c/**). Teste o funcionamento da build otimizada do Next.js (RSC e cache), verifique erros em tempo de deploy e valide pipelines opcionais de testes automáticos e verificação de regras.”


