# Manual Técnico do WhatsAi

## Visão Geral

O WhatsAi é uma aplicação web moderna para gestão de relacionamento com o cliente, construída com Next.js e Firebase. O sistema é projetado para um **único atendente** que gerencia sua própria marca, contatos e interações de chat.

A arquitetura utiliza o App Router do Next.js, Server Components, e Server Actions para lógica de backend, hospedada de forma integrada no Firebase App Hosting. O Firebase é utilizado para autenticação, banco de dados (Firestore) e armazenamento de arquivos (Storage).

## Estrutura do Projeto

-   `/src/app`: Rotas da aplicação (App Router).
    -   `/`: Página de Onboarding/Login.
    -   `/dashboard`: Layout e páginas principais do atendente.
    -   `/client-chat/[brandId]`: PWA de chat para o cliente final.
-   `/src/components`: Componentes React reutilizáveis (UI e de funcionalidade).
-   `/src/firebase`: Configuração e hooks do Firebase.
-   `/src/ai`: Fluxos de IA com Genkit, executados via Server Actions.
-   `/docs/backend.json`: Define as entidades de dados para o Firestore.
-   `/firestore.rules`: Regras de segurança do banco de dados.

## Fluxo de Dados e Componentes

### 1. Onboarding e Autenticação

-   **Fluxo**: Um novo atendente acessa a página inicial e passa por um fluxo de onboarding obrigatório (`/src/components/onboarding-flow.tsx`).
-   **Dados Coletados**: Nome da marca, slogan, avatar, nome do atendente e credenciais de login.
-   **Ação**: A função `createBrandAndUser` (`/src/firebase/firestore/mutations.ts`) é chamada.
    -   Cria um usuário no Firebase Auth.
    -   Faz upload do avatar para o Firebase Storage.
    -   Cria um documento `user` e um `brand` no Firestore, usando o UID do usuário como ID para ambos, estabelecendo a relação 1:1.
-   **Redirecionamento**: Após o sucesso, o atendente é redirecionado para `/dashboard`.

### 2. Painel do Atendente

-   **Layout Principal** (`/src/app/dashboard/layout.tsx`):
    -   Verifica a autenticação do usuário.
    -   Busca os dados do `user` e `brand` do Firestore para exibir informações como o nome e o avatar do atendente no cabeçalho.
    -   Fornece navegação para as seções de Chat e Contatos.
    -   Inclui o botão "Copiar link do chat", que gera a URL pública (`/client-chat/[userId]`).

-   **Página de Chats** (`/src/app/dashboard/page.tsx`):
    -   Busca todos os chats associados ao `brandId` do atendente.
    -   Busca os contatos para "hidratar" os chats com nomes e avatares.
    -   Apresenta uma interface de três painéis (`ChatLayout`) para listar as conversas, exibir o chat ativo e mostrar os detalhes do contato.

-   **Página de Contatos** (`/src/app/dashboard/contacts/page.tsx`):
    -   Exibe uma tabela com todos os contatos do atendente.
    -   Permite a adição de novos contatos e a edição/exclusão dos existentes através de um painel lateral (`Sheet`).

### 3. Chat do Cliente (PWA)

-   **Acesso**: O cliente final acessa a URL `dominio.com/client-chat/[brandId]`, onde `brandId` é o UID do atendente.
-   **Fluxo**:
    1.  A página (`/src/app/client-chat/[brandId]/page.tsx`) busca os dados públicos da `brand` (nome, slogan) e do `user` (avatar, nome do atendente) para exibir um "cartão de visitas".
    2.  O cliente insere o número de telefone para se identificar.
    3.  O sistema localiza ou cria um `contact` no Firestore.
    4.  Um `chat` é localizado ou criado, vinculando o `contactId` e o `brandId`.
    5.  Uma Server Action (`getInitialGreetingAction`) é chamada para gerar uma saudação inicial da IA, que é adicionada como a primeira mensagem.
    6.  A interface de chat em tempo real é carregada, ouvindo a coleção de `messages` do chat no Firestore.

### 4. Lógica de Servidor (Server Actions)

-   **Ponto Central**: `/src/app/actions.ts`.
-   **Funcionamento**: As Server Actions são funções `async` marcadas com `'use server'`. Elas são chamadas diretamente de componentes do cliente, mas executam exclusivamente no servidor (via App Hosting).
-   **Exemplos**: `getInitialGreetingAction`, `getChatSummaryAction`. Essas ações importam e executam os fluxos de IA definidos em `/src/ai/flows/`. Isso elimina a necessidade de gerenciar Cloud Functions separadas para a lógica de negócio.
