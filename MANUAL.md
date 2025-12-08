# Manual Técnico: WhatsAi

## 1. Visão Geral e Arquitetura

O WhatsAi é uma plataforma inteligente para gestão de identidade de marca e relacionamento com o cliente, operada por um único atendente. Construída sobre uma arquitetura moderna que combina Next.js, Firebase e Genkit (Google AI), seu objetivo é centralizar a comunicação, otimizar a eficiência do atendente e enriquecer os perfis de contato com inteligência artificial.

### 1.1. Arquitetura Implementada

A arquitetura atual é focada na simplicidade e no poder da integração entre o frontend e o backend no mesmo ambiente.

```
[Firebase Backend] <------> [Next.js App (App Router + Server Actions)] <------> [React Frontend (Onboarding & Dashboard)]
       |                            |                                                |
   [Firestore DB] <--- [Firebase Client SDK] -----------------------------------> [ShadCN UI]
       |                            |                                                |
 [Authentication] <---- [Genkit AI Flows (em Server Actions)] ------------------> [Tailwind CSS]
```

-   **Backend (Firebase):** Firestore armazena dados da marca, do atendente, dos contatos e dos chats. Firebase Authentication gerencia a identidade do atendente. Storage armazena o avatar.
-   **Aplicação Next.js (App Hosting):** A aplicação é executada em um ambiente unificado. O App Router gerencia as rotas do frontend. As **Server Actions** (`/src/app/actions.ts`) invocam os fluxos de IA do Genkit diretamente no servidor, eliminando a necessidade de Cloud Functions separadas.
-   **Frontend (React):** O fluxo de Onboarding, o Dashboard do atendente e a PWA do cliente são construídos com React, componentes ShadCN e estilização com Tailwind CSS. Os dados são consumidos em tempo real do Firestore.
-   **Inteligência Artificial (Genkit):** Os fluxos de IA (`/src/ai/flows/`) são definidos como parte da aplicação Next.js e são acionados pelas Server Actions, de forma integrada.

### 1.2. Estrutura de Arquivos

A estrutura de arquivos reflete essa abordagem integrada.

```
/src
|-- /app
|   |-- /(dashboard)       # Rotas e layouts do painel do atendente
|   |-- /client-chat       # Layout e página da PWA do cliente
|   |-- /api/genkit        # API Route (usada pelo Genkit para expor fluxos)
|   `-- actions.ts         # Server Actions que invocam os fluxos de IA
|-- /ai
|   `-- /flows             # Definições dos fluxos de IA com Genkit (o "backend" da IA)
|-- /components
|   |-- /chat              # Componentes do sistema de chat
|   |-- /onboarding-flow.tsx # Componente de fluxo de cadastro
|   `-- /ui                # Componentes reutilizáveis (ShadCN)
|-- /firebase
|   |-- config.ts          # Configuração de conexão com o Firebase
|   |-- mutations.ts       # Funções para escrever dados no Firestore
|   `-- provider.tsx       # Provedor de contexto do Firebase
`-- MANUAL.md              # Este documento
```

---

## 2. Onboarding e Contexto da Marca

O fluxo de onboarding é a porta de entrada, onde o atendente define sua identidade de marca e cria sua conta. A relação é de **um atendente para uma marca**.

### 2.1. Coleta de Dados e Armazenamento

O formulário (`/src/components/onboarding-flow.tsx`) coleta os dados e, ao ser submetido, a função `createBrandAndUser` (`/src/firebase/firestore/mutations.ts`) realiza as seguintes ações:
-   Cria um novo usuário no **Firebase Authentication**.
-   Cria um documento para a marca na coleção `/brands`, usando o ID do usuário como ID do documento para criar um vínculo direto.
-   Cria um documento para o atendente na coleção `/users`, associando-o à marca.

**Status:** **Completo e Funcional**.

---

## 3. Gestão de Contatos (CRM)

O sistema de gestão de contatos permite ao atendente gerenciar todos os seus clientes.

### 3.1. Estrutura de Dados do Contato

O tipo `Contact` (`/src/lib/types.ts`) e o `backend.json` definem a estrutura do contato. A página de contatos (`/src/app/dashboard/contacts`) exibe uma lista de contatos do Firestore pertencentes à marca do atendente.

### 3.2. Funcionalidades Implementadas

-   **CRUD de Contatos:** Os botões "Adicionar Contato", "Editar" e "Deletar" estão funcionais e realizam operações de escrita no Firestore.
-   **Visualização de Dados Reais:** A página de contatos exibe os contatos reais da coleção `/contacts` do Firestore.

---

## 4. Sistema de Chat em Tempo Real

A interface de chat é o coração do dashboard e está conectada em tempo real com o Firestore.

### 4.1. Estrutura e Dados

-   O layout do chat (`/src/components/chat/chat-layout.tsx`) organiza a lista de conversas, a janela de chat e o painel de detalhes do contato.
-   A `ChatList` busca e exibe as conversas da coleção `/chats` em tempo real.
-   A `ChatWindow` busca e exibe as mensagens da subcoleção `/chats/{chatId}/messages` e permite o envio de novas mensagens pelo atendente.
-   O `ContactPanel` exibe os detalhes do contato selecionado.

**Status:** **Completo e Funcional**.

---

## 5. PWA do Cliente

A PWA do cliente (`/client-chat/[brandId]`) permite que o usuário final inicie e mantenha uma conversa com a marca/atendente.

### 5.1. Fluxo Atual

1.  **Identificação:** A página solicita o número de telefone do cliente.
2.  **Busca/Criação de Contato e Chat:** O sistema verifica se existe um contato com aquele número. Se não existir, um novo contato é criado. Em seguida, verifica se há um chat ativo para ele.
3.  **Criação de Novo Chat:** Se não houver um chat ativo, um novo é criado na coleção `/chats`. Uma saudação inicial é gerada pela IA (`generateInitialGreeting`) e salva como a primeira mensagem.
4.  **Chat em Tempo Real:** O cliente pode enviar e receber mensagens que são sincronizadas em tempo real com o dashboard do atendente.

**Status:** **Completo e Funcional**.

---

## 6. Ferramentas de IA e Automações (Via Server Actions)

As ferramentas de IA no `ContactPanel` são acionadas via **Server Actions**, que executam os fluxos do Genkit no ambiente do servidor Next.js.

### 6.1. Fluxo Atual

-   Os botões "Gerar Resumo", "Sugerir Enriquecimentos" e "Gerar Acompanhamentos" estão funcionais e invocam os respectivos fluxos de IA.
-   Os resultados são exibidos na interface do atendente.

### 6.2. Funcionalidades Futuras

-   **Persistência dos Resultados da IA:** Salvar os resumos gerados na subcoleção `/chats/{chatId}/summaries` e os enriquecimentos aceitos no documento do contato.
-   **Mecanismo de Aceitar/Rejeitar:** Implementar a lógica nos botões para que o atendente possa aprovar ou descartar as sugestões de enriquecimento.
-   **Automações:** Implementar os switches de configuração de IA para acionar os fluxos automaticamente (ex: gerar resumo ao fechar um chat).
-   **Tratamento de Erros e Gerenciamento de Contexto.**
