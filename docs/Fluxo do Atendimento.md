### Título: O Ciclo de Vida do Atendimento: Do Cliente ao Atendente

Este documento descreve o fluxo de dados e interações que ocorrem desde o momento em que um cliente inicia uma conversa até a resposta do atendente.

---

#### Visão Geral do Fluxo Funcional

1.  **Geração do Link:** No dashboard (`/dashboard`), o Atendente clica em "Copiar link do chat". A aplicação gera uma URL única no formato `seusite.com/c/[brandId]`.

2.  **Início pelo Cliente:** O cliente acessa esta URL. A regra de reescrita no `next.config.ts` o direciona para a página de chat do cliente (`/client-chat/[brandId]`). Ele insere suas informações (ex: número de telefone) e envia a primeira mensagem.

3.  **Criação dos Dados:** A ação do cliente dispara a criação de dois documentos em **coleções raiz** no Firestore:
    *   Um novo documento na coleção `/chats`, contendo o ID da marca (`brandId`) e o ID do atendente (`attendantId`).
    *   Um novo documento na coleção `/contacts`.

4.  **Recepção pelo Atendente:** O dashboard do atendente, que está constantemente monitorando (`subscribing to`) a coleção `/chats`, busca por documentos onde o `attendantId` corresponde ao seu próprio ID de usuário.

5.  **Exibição em Tempo Real:** Ao detectar um novo chat que corresponde ao seu ID, o dashboard exibe a nova conversa na lista, permitindo que o atendente a abra e inicie a interação.

---

#### Detalhes Técnicos: O Modelo de Dados Unificado

A chave para o funcionamento deste fluxo é o uso de **coleções raiz** no Firestore, que servem como uma "praça pública" centralizada de dados.

*   **Ponto de Escrita (Cliente):** A página `/client-chat/[brandId]/page.tsx` escreve novos documentos diretamente nas coleções `/chats` e `/contacts`.
    *   `collection(firestore, 'chats')`
    *   `collection(firestore, 'contacts')`

*   **Ponto de Leitura (Atendente):** A página do dashboard (`/dashboard/page.tsx`) lê dessas mesmas coleções raiz, mas usando filtros para buscar apenas os documentos que lhe pertencem.
    *   `query(collection(firestore, 'chats'), where("attendantId", "==", user.uid))`
    *   `query(collection(firestore, 'contacts'), where("brandId", "==", user.brandId))`

Este modelo unificado garante que ambos os lados da aplicação (cliente e atendente) estejam sempre olhando para a mesma fonte de dados, eliminando a possibilidade de desencontros.

---

#### Apêndice: Contexto Histórico da Arquitetura

A arquitetura atual foi implementada para corrigir uma falha no modelo de dados inicial. Anteriormente, a aplicação operava com um modelo de "caixa de correio particular", onde:

*   **O Cliente escrevia** em coleções raiz (`/chats`).
*   **O Atendente lia** de subcoleções aninhadas e específicas do usuário (`/users/{userId}/chats`).

Essa discrepância fazia com que o atendente nunca encontrasse os chats que o cliente criava. A decisão foi unificar todo o acesso de leitura e escrita para as coleções raiz, usando filtros para segmentar os dados, resultando na arquitetura robusta e funcional que temos hoje.
