# Manual Técnico: WhatsAi

## 1. Visão Geral e Arquitetura

O WhatsAi é uma plataforma inteligente para gestão de contatos e atendimento ao cliente via chat, construída sobre uma arquitetura moderna que combina Next.js, Firebase e Genkit (Google AI). O objetivo é centralizar a comunicação, otimizar a eficiência do atendente e enriquecer os perfis de contato com inteligência artificial.

### 1.1. Arquitetura Implementada

A arquitetura atual é funcional e robusta, com os principais sistemas de dados e comunicação em tempo real já implementados.

```
[Firebase Backend] <------> [Next.js Server (App Router)] <------> [React Frontend (Onboarding & Dashboard)]
       |                            |                                    |
   [Firestore DB] <--- [Firebase Client SDK] ----------------------> [ShadCN UI]
       |                            |                                    |
 [Authentication] <---- [Genkit AI Flows (Server Actions)] -------> [Tailwind CSS]
```

-   **Backend (Firebase):** Firestore armazena dados de marcas, usuários, contatos e chats. Firebase Authentication gerencia a identidade dos atendentes. As operações de leitura e escrita são feitas em tempo real.
-   **Servidor (Next.js):** O App Router gerencia as rotas. As `Server Actions` (`/src/app/actions.ts`) invocam os fluxos de IA do Genkit.
-   **Frontend (React):** O fluxo de Onboarding, o Dashboard do atendente e a PWA do cliente são construídos com React, componentes ShadCN e estilização com Tailwind CSS. Os dados são consumidos em tempo real do Firestore.
-   **Inteligência Artificial (Genkit):** Os fluxos de IA (`/src/ai/flows/`) estão definidos e são acionados manualmente através da interface do atendente.

### 1.2. Estrutura de Arquivos

A estrutura de arquivos está organizada para suportar a arquitetura descrita, separando as responsabilidades de UI, lógica de servidor, IA e configuração do Firebase.

```
/src
|-- /app
|   |-- /(dashboard)       # Rotas e layouts do painel do atendente (conectado ao Firestore)
|   |-- /client-chat       # Layout e página da PWA do cliente (conectado ao Firestore)
|   |-- /api/genkit        # API Route que expõe os fluxos de IA para produção
|   `-- actions.ts         # Server Actions para invocar fluxos de IA
|-- /ai
|   `-- /flows             # Definições dos fluxos de IA com Genkit
|-- /components
|   |-- /chat              # Componentes do sistema de chat (conectados ao Firestore)
|   |-- /onboarding-flow.tsx # Componente de fluxo de cadastro
|   `-- /ui                # Componentes reutilizáveis (ShadCN)
|-- /firebase
|   |-- config.ts          # Configuração de conexão com o Firebase
|   |-- mutations.ts       # Funções para escrever dados no Firestore
|   `-- provider.tsx       # Provedor de contexto do Firebase
|-- /lib
|   |-- data.ts            # Arquivo de dados mockados (agora obsoleto)
|   |-- types.ts           # Definições de tipos TypeScript
|   `-- utils.ts           # Funções utilitárias
`-- MANUAL.md              # Este documento
```

---

## 2. Onboarding e Contexto da Marca

O fluxo de onboarding é a porta de entrada da aplicação, capturando a identidade da marca e os dados do primeiro atendente.

### 2.1. Coleta de Dados e Armazenamento

O formulário (`/src/components/onboarding-flow.tsx`) coleta os dados e, ao ser submetido, a função `createBrandAndUser` (`/src/firebase/firestore/mutations.ts`) realiza as seguintes ações:
-   Cria um novo usuário no **Firebase Authentication**.
-   Cria um documento para a marca na coleção `/brands` do Firestore.
-   Cria um documento para o usuário na coleção `/users`, associado à marca.

**Status:** **Completo e Funcional**.

---

## 3. Gestão de Contatos (CRM)

O sistema de gestão de contatos está parcialmente implementado. A base de dados existe e é consumida pelo chat, mas a interface de gerenciamento ainda não é funcional.

### 3.1. Estrutura de Dados do Contato

O tipo `Contact` (`/src/lib/types.ts`) e o `backend.json` definem a estrutura do contato. A página de contatos (`/src/app/dashboard/contacts`) atualmente exibe uma lista de contatos mockados.

### 3.2. Funcionalidades Futuras

-   **CRUD de Contatos:** Conectar os botões "Adicionar Contato", "Editar" e "Deletar" para realizar operações de escrita no Firestore.
-   **Visualização de Dados Reais:** Substituir os dados mockados na página de contatos por uma consulta real à coleção `/contacts` do Firestore.
-   **Importação de Contatos:** Implementar a funcionalidade de importação de contatos (ex: via CSV).

---

## 4. Sistema de Chat em Tempo Real

A interface de chat é o coração do dashboard e está conectada em tempo real com o Firestore.

### 4.1. Estrutura e Dados

-   O layout do chat (`/src/components/chat/chat-layout.tsx`) organiza a `ChatList`, `ChatWindow` e `ContactPanel`.
-   A `ChatList` busca e exibe as conversas da coleção `/chats` em tempo real.
-   A `ChatWindow` busca e exibe as mensagens da subcoleção `/chats/{chatId}/messages` e permite o envio de novas mensagens pelo atendente.
-   O `ContactPanel` exibe os detalhes do contato selecionado, buscando os dados do documento correspondente na coleção `/contacts`.

**Status:** **Completo e Funcional**.

### 4.2. Funcionalidades Futuras

-   **Indicador de "Digitando...":** Implementar um status visual para quando o cliente ou o atendente estiver digitando.
-   **Notificações:** Adicionar notificações sonoras ou visuais para novas mensagens em chats não selecionados.
-   **Mudança de Status do Chat:** Implementar a lógica para que o atendente possa alterar manualmente o status de um chat (ex: "Fechado", "Arquivado").

---

## 5. PWA do Cliente

A PWA do cliente (`/client-chat`) permite que o usuário final inicie e mantenha uma conversa com a marca.

### 5.1. Fluxo Atual

1.  **Identificação:** A página (`/src/app/client-chat/page.tsx`) solicita o número de telefone do cliente.
2.  **Busca de Contato e Chat:** O sistema verifica se existe um contato com aquele número e se há um chat ativo para ele.
3.  **Criação de Novo Chat:** Se não houver um chat ativo, um novo é criado na coleção `/chats` do Firestore. Uma saudação inicial é gerada pela IA (`generateInitialGreeting`) e salva como a primeira mensagem.
4.  **Chat em Tempo Real:** O cliente pode enviar e receber mensagens que são sincronizadas em tempo real com o dashboard do atendente.

**Status:** **Completo e Funcional**.

### 5.2. Funcionalidades Futuras

-   **Injeção de Contexto da Marca:** O fluxo `generateInitialGreeting` deve receber o `brandTone`, `softRules`, etc., para personalizar a saudação de acordo com a marca específica. Atualmente, a saudação é genérica.
-   **Controle de Sessão Avançado:** Implementar a lógica descrita no manual para reabertura de chats. Se um atendente fecha o chat manualmente, o cliente não deve reabri-lo; um novo chat deve ser criado.

---

## 6. Ferramentas de IA e Automações

As ferramentas de IA no `ContactPanel` estão conectadas às `Server Actions` e podem invocar os fluxos do Genkit.

### 6.1. Fluxo Atual

-   Os botões "Gerar Resumo", "Sugerir Enriquecimentos" e "Gerar Acompanhamentos" estão funcionais e invocam os respectivos fluxos de IA.
-   Os resultados (resumo, sugestões) são exibidos na interface do atendente.

### 6.2. Funcionalidades Futuras

-   **Persistência dos Resultados da IA:** Os resultados gerados pelas ferramentas de IA (resumos, enriquecimentos) devem ser salvos no Firestore.
    -   Resumos devem ir para a subcoleção `/chats/{chatId}/summaries`.
    -   Enriquecimentos aceitos pelo atendente devem atualizar o documento do contato em `/contacts/{contactId}`.
-   **Mecanismo de Aceitar/Rejeitar:** Implementar a lógica nos botões de "joinha" para que o atendente possa aprovar ou descartar as sugestões de enriquecimento. A ação aprovada deve disparar a atualização no Firestore.
-   **Automações:** Implementar os switches de configuração de IA do onboarding para acionar os fluxos de IA automaticamente (ex: gerar resumo ao fechar um chat).
-   **Tratamento de Erros da IA:** Implementar a lógica de _fallback_, _timeout_ e _retry_ para os fluxos do Genkit, salvando logs de erro na coleção `/ai_logs`.
-   **Gerenciamento de Contexto:** Refinar os prompts e fluxos para gerenciar o contexto em conversas longas, utilizando resumos anteriores e notas do contato para manter a coerência.
