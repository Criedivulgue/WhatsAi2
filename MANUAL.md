# Manual Técnico: WhatsAi

## 1. Visão Geral e Arquitetura

O WhatsAi é uma plataforma inteligente para gestão de contatos e atendimento ao cliente via chat, construída sobre uma arquitetura moderna que combina Next.js, Firebase e Genkit (Google AI). O objetivo é centralizar a comunicação, otimizar a eficiência do atendente e enriquecer o relacionamento com o cliente através do uso estratégico de Inteligência Artificial.

### 1.1. Mapa do Sistema (Diagrama Textual)

A arquitetura é dividida em camadas que se comunicam de forma clara:

```
[Firebase Backend] <------> [Next.js Server (App Router)] <------> [React Frontend (Dashboard & PWA)]
       |                            |                                    |
   [Firestore DB] <------------ [Server Actions] <-------------------- [ShadCN UI]
       |                            |                                    |
 [Authentication] <----- [Genkit AI Flows (Google AI)] <------------ [Tailwind CSS]
       |
 [Security Rules]
```

-   **Backend (Firebase):** Firestore atua como banco de dados NoSQL em tempo real, e o Firebase Authentication gerencia a identidade dos atendentes. As Security Rules garantem o isolamento de dados por marca.
-   **Servidor (Next.js):** Utiliza o App Router para renderização no servidor (SSR) e Server Actions para executar lógica de backend segura, como a chamada para os fluxos de IA.
-   **Frontend (React):** A interface do atendente (Dashboard) e a PWA do cliente são construídas com React, usando componentes ShadCN e estilização com Tailwind CSS.
-   **Inteligência Artificial (Genkit):** Os fluxos de IA são definidos com Genkit, orquestrando chamadas para modelos do Google (Gemini) e garantindo saídas estruturadas.

### 1.2. Estrutura de Arquivos

```
/src
|-- /app
|   |-- /(dashboard)       # Rotas e layouts do painel do atendente
|   |-- /client-chat       # Rotas e layouts da PWA do cliente
|   |-- /api/genkit        # API Route para expor os fluxos de IA
|   `-- actions.ts         # Server Actions
|-- /ai
|   `-- /flows             # Definições dos fluxos de IA (Genkit)
|-- /components
|   |-- /chat              # Componentes do sistema de chat
|   `-- /ui                # Componentes reutilizáveis (ShadCN)
|-- /firebase
|   |-- config.ts          # Configuração de conexão com o Firebase
|   `-- provider.tsx       # Provedor de contexto do Firebase
|-- /lib
|   |-- data.ts            # Dados mockados para desenvolvimento
|   |-- placeholder-images # Imagens de exemplo
|   |-- types.ts           # Definições de tipos TypeScript
|   `-- utils.ts           # Funções utilitárias
`-- MANUAL.md              # Este documento
```

---

## 2. Onboarding e Contexto da Marca

O fluxo de onboarding é a etapa fundamental onde a identidade da marca é capturada para guiar todas as interações da IA.

### 2.1. Coleta de Dados

O usuário (atendente/gestor) fornece:
1.  **Nome da Marca:** Identificador principal.
2.  **Tom de Voz:** Descrição de como a marca deve soar (ex: "amigável e profissional", "técnico e direto", "divertido e informal").
3.  **Regras de Comunicação:** Um conjunto de diretrizes que a IA deve seguir.

### 2.2. Regras e Parâmetros da IA

As regras são divididas em duas categorias para criar um framework comportamental claro:

-   **Hard Rules (Regras Rígidas):** Proibições absolutas que a IA não pode violar. São injetadas no prompt como instruções de alta prioridade.
    -   *Exemplo:* "Nunca oferecer descontos não aprovados.", "Jamais prometer funcionalidades que não existem.", "Não usar gírias de forma alguma."
-   **Soft Rules (Regras Flexíveis):** Diretrizes de estilo que moldam a personalidade da IA, mas permitem flexibilidade.
    -   *Exemplo:* "Use emojis, mas com moderação.", "Prefira respostas curtas e diretas.", "Sempre cumprimente o cliente pelo nome."

-   **Comportamento da IA (Ligada/Desligada):** O atendente pode alternar o modo da IA (`AI-Assisted` vs. `Human-Only`).
    -   Quando **desligada**, a IA para de sugerir respostas e executar ações proativas. No entanto, ela continua a "ouvir" a conversa em segundo plano para manter o contexto. Isso permite que, ao ser reativada, ela possa gerar resumos ou sugestões instantaneamente, sem perder o fio da meada.

---

## 3. Gestão de Contatos (CRM) e Contexto Multi-Fonte

O CRM é o cérebro do WhatsAi. A IA utiliza um contexto rico e multi-fonte para todas as suas análises e sugestões, indo muito além do histórico do chat atual.

### 3.1. Tipos de Contato (Contact Type)

Esta é a classificação principal que define o relacionamento do contato com a marca. É um campo crítico para a IA adaptar sua estratégia.
-   `Lead`: Contato novo, pouco qualificado. A IA foca em qualificação e coleta de informações.
-   `Prospect`: Lead qualificado, demonstrou interesse. A IA foca em conversão e agendamento.
-   `Client`: Cliente ativo. A IA foca em suporte, satisfação e up-selling.
-   `VIP`: Cliente de alto valor. A IA adota um tom mais personalizado e prioriza o atendimento.
-   `Past Client`: Ex-cliente. A IA pode focar em reengajamento ou feedback.

### 3.2. Categorias e Interesses

-   **Categorias:** Tags internas para segmentação (ex: `Enterprise`, `Q4-Campaign`, `Support-Tier-1`).
-   **Interesses:** Tópicos de interesse do contato (ex: `Generative AI`, `Cloud Computing`).

### 3.3. Análise Multi-Fonte da IA

Quando uma ferramenta de IA é acionada (Resumo, Enriquecimento, Follow-up), ela não analisa apenas o chat atual. O prompt enviado ao modelo de linguagem inclui:
1.  **Histórico do Chat Atual.**
2.  **Resumos de Conversas Anteriores.**
3.  **Notas Internas** sobre o contato.
4.  **Tipo de Contato, Categorias e Interesses** atuais.
5.  **Status e histórico de comportamento** (ex: sentimento em chats passados).

Isso garante que as sugestões da IA sejam profundamente contextualizadas e relevantes.

---

## 4. Sistema de Chat e Estados

O chat é o coração operacional, organizado por estados para otimizar o fluxo de trabalho do atendente.

### 4.1. Estados do Chat

-   `Active`: Conversa em andamento, requer atenção imediata.
-   `Awaiting Return`: O atendente respondeu e aguarda o retorno do cliente.
-   `Closed`: A conversa foi resolvida e finalizada.
-   `Archived`: Conversa fechada e armazenada para histórico, não aparece na lista principal.
-   `AI-Assisted`: A IA está ativa, fornecendo sugestões em tempo real.

Esses estados são fundamentais para os dashboards, permitindo que os atendentes filtrem e priorizem seu trabalho.

---

## 5. PWA do Cliente e Controle de Sessão

A PWA oferece uma experiência de chat leve e sem atritos para o cliente final.

### 5.1. Fluxo de Sessão

1.  **Acesso e Identificação:** O cliente acessa via link e insere o número de telefone. Nenhuma conta é necessária. Uma breve **política de privacidade** é exibida, informando que o número é usado para identificar a sessão de chat.
2.  **Validade da Sessão:** Uma sessão de chat permanece "ativa" por um período pré-definido (ex: 24 horas). Se o cliente retornar dentro desse período, ele continua a mesma conversa.
3.  **Timeout e Reabertura:** Após o período de inatividade, o chat é movido para o estado `Closed`. Se o cliente com o mesmo número de telefone iniciar uma nova conversa, um novo chat é criado, mas vinculado ao histórico do contato, preservando o contexto para o atendente. Isso evita a reabertura infinita de chats antigos e mantém as conversas organizadas.

### 5.2. Brand Context Injection

Quando um novo chat é iniciado na PWA:
1.  O sistema recupera as informações da marca (Tom de Voz, Hard e Soft Rules).
2.  Um fluxo de IA (`generate-initial-greeting`) é acionado, recebendo o contexto da marca como parte do prompt.
3.  A IA gera uma saudação inicial que reflete a personalidade da marca, garantindo uma experiência consistente desde o primeiro contato.

---

## 6. Ferramentas de IA e Automação

### 6.1. Resumo, Enriquecimento e Follow-Up

Conforme descrito na seção 3.3, essas ferramentas usam um contexto multi-fonte para gerar:
-   **Resumos:** Visão geral, itens de ação e análise de sentimento.
-   **Enriquecimento:** Sugestões de novos `Interesses`, `Categorias` ou mudança de `Contact Type`.
-   **Follow-ups:** Rascunhos de e-mail e WhatsApp.

### 6.2. Sistema de Notificações e Eventos

Para completar o ciclo de automação, o sistema de follow-up também inclui:
-   **Notificações Internas:** Se a IA identifica um item de ação com prazo (ex: "Enviar proposta até sexta-feira"), o sistema cria uma notificação no painel do atendente responsável.
-   **Agendamento de Eventos:** A IA pode sugerir a criação de um evento no Google Calendar, pré-preenchendo título, descrição e convidados com base no contexto da conversa, aguardando apenas a confirmação do atendente.

---

## 7. Logs de IA e Auditoria

Para garantir transparência, depuração e melhoria contínua, cada ação da IA é registrada no Firestore.

### 7.1. Estrutura do Log (`/ai_logs/{logId}`)

-   `flowName`: Nome do fluxo Genkit acionado (ex: `generateChatSummaryFlow`).
-   `modelUsed`: Modelo de linguagem utilizado (ex: `gemini-2.5-flash`).
-   `inputHash`: Hash do objeto de entrada para referência.
-   `outputJSON`: O JSON bruto retornado pelo modelo.
-   `userAction`: Ação do atendente (`accepted` ou `dismissed`), se aplicável.
-   `timestamp`: Data e hora da execução.

---

## 8. Estrutura de Dados no Firestore

```
/brands/{brandId}
  - brandName: string
  - brandTone: string
  - hardRules: string
  - softRules: string
  - ownerId: string

/users/{userId}
  - name: string
  - email: string
  - brandId: string

/contacts/{contactId}
  - name: string
  - email: string
  - phone: string
  - contactType: string ('Lead', 'Client', etc.)
  - brandId: string
  - categories: array<string>
  - interests: array<string>
  - notes: string

/chats/{chatId}
  - contactId: string
  - brandId: string
  - attendantId: string
  - status: string ('Active', 'Closed', etc.)
  - lastMessageTimestamp: timestamp
  - /messages/{messageId}
    - sender: string
    - content: string
    - timestamp: timestamp
  - /summaries/{summaryId}
    - summaryText: string
    - actionItems: array<string>
    - sentiment: string ('Positive', 'Neutral', 'Negative')
    - createdAt: timestamp

/ai_logs/{logId}
  - flowName: string
  - modelUsed: string
  - inputHash: string
  - outputJSON: string
  - userAction: string ('accepted', 'dismissed')
  - timestamp: timestamp
```
