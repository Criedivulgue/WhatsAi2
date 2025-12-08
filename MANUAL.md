# Manual Técnico: WhatsAi

## 1. Visão Geral e Arquitetura

O WhatsAi é uma plataforma inteligente para gestão de contatos e atendimento ao cliente via chat, construída sobre uma arquitetura moderna que combina Next.js, Firebase e Genkit (Google AI). O objetivo é centralizar a comunicação e otimizar a eficiência do atendente.

### 1.1. Arquitetura Implementada

A arquitetura atual foca na fundação da aplicação, permitindo o cadastro de marcas e atendentes, e a visualização de uma interface de chat com dados de exemplo.

```
[Firebase Backend] <------> [Next.js Server (App Router)] <------> [React Frontend (Onboarding & Dashboard)]
       |                            |                                    |
   [Firestore DB] <--- [Firebase Client SDK] ----------------------> [ShadCN UI]
       |                            |                                    |
 [Authentication] <----- [Genkit AI Flows (Mocked)] <--------------- [Tailwind CSS]
```

-   **Backend (Firebase):** Firestore é usado para armazenar dados de marcas, usuários e contatos. Firebase Authentication gerencia a identidade dos atendentes.
-   **Servidor (Next.js):** Utiliza o App Router. Server Actions invocam os fluxos de IA.
-   **Frontend (React):** O fluxo de Onboarding e o Dashboard do atendente são construídos com React, componentes ShadCN e estilização com Tailwind CSS.
-   **Inteligência Artificial (Genkit):** Os fluxos de IA (`generateChatSummary`, `suggestProfileEnrichments`, etc.) estão definidos com Genkit, mas a integração completa com a UI e o acionamento automático ainda estão em desenvolvimento.

### 1.2. Estrutura de Arquivos

```
/src
|-- /app
|   |-- /(dashboard)       # Rotas e layouts do painel do atendente (com dados mockados)
|   |-- /client-chat       # Layout e página inicial da PWA do cliente
|   |-- /api/genkit        # API Route para expor os fluxos de IA
|   `-- actions.ts         # Server Actions para invocar fluxos de IA
|-- /ai
|   `-- /flows             # Definições dos fluxos de IA com Genkit
|-- /components
|   |-- /chat              # Componentes do sistema de chat (usando dados mockados)
|   |-- /onboarding-flow.tsx # Componente de fluxo de cadastro
|   `-- /ui                # Componentes reutilizáveis (ShadCN)
|-- /firebase
|   |-- config.ts          # Configuração de conexão com o Firebase
|   |-- mutations.ts       # Funções para escrever dados no Firestore
|   `-- provider.tsx       # Provedor de contexto do Firebase
|-- /lib
|   |-- data.ts            # Dados mockados para desenvolvimento
|   |-- types.ts           # Definições de tipos TypeScript
|   `-- utils.ts           # Funções utilitárias
`-- MANUAL.md              # Este documento
```

---

## 2. Onboarding e Contexto da Marca

O fluxo de onboarding é a primeira etapa implementada. Ele captura a identidade da marca e os dados do primeiro atendente.

### 2.1. Coleta de Dados e Armazenamento

O formulário de onboarding (`/src/components/onboarding-flow.tsx`) coleta:
1.  **Dados da Marca:** Nome da Marca, Tom de Voz, Regras Rígidas (Hard Rules) e Regras Flexíveis (Soft Rules).
2.  **Dados do Atendente:** Nome, E-mail e Senha.
3.  **Configurações de IA:** Preferências iniciais para automações (ex: `autoSummarize`).

Ao submeter o formulário, a função `createBrandAndUser` (`/src/firebase/firestore/mutations.ts`) é chamada para:
-   Criar um novo usuário no **Firebase Authentication**.
-   Criar um documento para a marca na coleção `/brands` do Firestore.
-   Criar um documento para o usuário na coleção `/users` do Firestore, associado à marca.

Este módulo está **funcional**.

---

## 3. Gestão de Contatos (CRM)

A estrutura de dados para o CRM está definida, mas as operações de criação, edição e exclusão (CRUD) através da interface do usuário ainda não foram implementadas.

### 3.1. Estrutura de Dados do Contato

O tipo `Contact` (`/src/lib/types.ts`) e o `backend.json` definem a estrutura de um contato, que inclui:
-   **contactType:** Classificação do relacionamento (`Lead`, `Prospect`, `Client`, `VIP`, `Past Client`). Essencial para a IA contextualizar suas interações.
-   **categories:** Tags internas para segmentação.
-   **interests:** Tópicos de interesse do contato, extraídos pela IA ou adicionados manualmente.
-   **notes:** Anotações internas do atendente.

A página de contatos (`/src/app/dashboard/contacts`) atualmente exibe uma lista de contatos mockados de `/src/lib/data.ts`. As ações de "Editar" e "Deletar" exibem um toast, indicando que a funcionalidade não está implementada.

---

## 4. Sistema de Chat

A interface de chat está montada, mas opera com dados mockados. A conexão em tempo real com o Firestore ainda não foi implementada.

### 4.1. Estrutura e Dados

-   O layout do chat (`/src/components/chat/chat-layout.tsx`) divide a tela em lista de conversas, janela de chat e painel de contato.
-   Os componentes `ChatList`, `ChatWindow` e `ContactPanel` são populados com os dados de `mockChats` de `/src/lib/data.ts`.
-   As ferramentas de IA no `ContactPanel` estão conectadas às `Server Actions` e podem invocar os fluxos do Genkit, mas ainda não salvam os resultados no Firestore ou atualizam o perfil do contato.

### 4.2. Funcionalidades Futuras
-   Conectar o chat ao Firestore para troca de mensagens em tempo real.
-   Implementar a lógica de mudança de estado do chat (`Active`, `Closed`, etc.).
-   Salvar os resultados das ferramentas de IA (resumos, enriquecimentos) no banco de dados.

---

## 5. PWA do Cliente

A estrutura inicial da PWA do cliente existe, mas a funcionalidade completa de sessão e chat em tempo real não está implementada.

### 5.1. Fluxo Atual
1.  **Identificação:** A página (`/src/app/client-chat/page.tsx`) solicita o número de telefone do cliente.
2.  **Saudação da IA:** Após inserir o número, uma `Server Action` (`getInitialGreetingAction`) é chamada para obter uma saudação inicial gerada pela IA.
3.  **Chat Simulado:** O cliente pode enviar mensagens, mas as respostas do assistente são pré-definidas e não há conexão com o dashboard do atendente.

### 5.2. Funcionalidades Futuras
-   Implementar controle de sessão baseado no número de telefone.
-   Estabelecer a conexão em tempo real com o Firestore para que as mensagens apareçam no dashboard do atendente.
-   Injetar o contexto da marca (`brandTone`, `softRules`, etc.) no fluxo `generateInitialGreeting` para personalizar a saudação.

---

## 6. Estrutura de Dados no Firestore

A estrutura de coleções no Firestore está definida em `docs/backend.json` e reflete o planejamento completo. As coleções principais são:

```
/brands/{brandId}
/users/{userId}
/contacts/{contactId}
/chats/{chatId}
  /messages/{messageId}
  /summaries/{summaryId}
/ai_logs/{logId}
```
A implementação atual se concentra na criação de documentos nas coleções `/brands` e `/users` durante o onboarding. As outras coleções serão utilizadas à medida que os módulos de Chat e CRM forem conectados ao backend.
