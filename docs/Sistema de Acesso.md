### Título: Sistema de Acesso e Onboarding do Atendente

**Nota de Arquitetura Importante:** Este documento descreve o fluxo de login e registro para **Atendentes** da plataforma. A aplicação também possui **áreas públicas** (como o chat do cliente) que não exigem autenticação. Para uma visão completa da separação entre áreas públicas e privadas, consulte o documento `docs/Arquitetura de Roteamento e Acesso.md`, que é a fonte de verdade sobre o roteamento.

---

#### Fluxo de Registro e Onboarding (Novo Atendente)

1.  **Ponto de Partida:** Todo **Atendente** novo começa seu fluxo na página raiz da aplicação (`/`), que serve como portal de autenticação.

2.  **Criação da Credencial:** O novo atendente insere e-mail e senha. A função `createUserWithEmailAndPassword` do Firebase Auth é chamada.

3.  **Redirecionamento para Onboarding:** Após a criação da credencial, o atendente é **imediatamente redirecionado** para uma página de Onboarding obrigatório.

4.  **Coleta de Dados Essenciais:** A página de Onboarding coleta as informações fundamentais da marca e do perfil:
    *   Nome da Marca
    *   Slogan (opcional)
    *   Seu Nome Público (Nome do Atendente)
    *   Avatar/Foto de Perfil

5.  **Salvando no Firestore:** Ao submeter o Onboarding, os dados são persistidos nas coleções `brands` e `users`, e a associação entre eles é criada.

6.  **Acesso ao Dashboard:** Apenas após a conclusão bem-sucedida do Onboarding, o atendente é finalmente redirecionado para o `/dashboard`.

#### Fluxo de Login (Atendente Existente)

1.  **Autenticação:** Um atendente já existente insere seu e-mail e senha na página inicial.
2.  **Verificação:** A função `signInWithEmailAndPassword` do Firebase Auth é chamada.
3.  **Acesso Direto:** Se as credenciais estiverem corretas, ele é redirecionado diretamente para o `/dashboard`.

---

#### O Coração da Segurança: O `<AuthGate>`

O componente que garante que apenas atendentes logados acessem as áreas protegidas é o `<AuthGate>`.

*   **Como Funciona:** Este componente está implementado no arquivo `src/app/dashboard/layout.tsx` e "abraça" toda a área do dashboard.
*   **Verificação:** Ele verifica se há um usuário autenticado.
*   **Redirecionamento Automático:** Se um usuário **não autenticado** tentar acessar qualquer URL dentro de `/dashboard/...`, o `<AuthGate>` o redirecionará forçadamente de volta para a página de login (`/`).
*   **Referência de Arquitetura:** Esta abordagem está perfeitamente alinhada com o padrão descrito em `docs/Arquitetura de Roteamento e Acesso.md` e garante que a proteção seja aplicada apenas às seções privadas da aplicação.
