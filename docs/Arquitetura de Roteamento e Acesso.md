### Título: Arquitetura de Roteamento e Acesso - A Verdade Única

Este documento descreve a arquitetura de roteamento e controle de acesso da aplicação. Seguir este padrão é **mandatório** para garantir a segurança da plataforma e a disponibilidade das páginas públicas. Qualquer desvio deste modelo resultará em falhas críticas, como as que corrigimos hoje.

#### A Filosofia Central: Separação Explícita

A aplicação é dividida em duas áreas distintas e independentes:

1.  **Área Pública:** Páginas que **qualquer pessoa** pode acessar sem login. Ex: A página de chat do cliente.
2.  **Área Privada (Dashboard):** Páginas que **exigem autenticação** e só podem ser acessadas por um Atendente logado.

A proteção **NUNCA** deve ser global. Ela deve ser aplicada apenas onde é estritamente necessária.

---

### Como Funciona na Prática

#### 1. O Layout Raiz (`src/app/layout.tsx`) - A Casca Global

Este é o arquivo mais importante e o mais sensível.

*   **Função:** Ele "abraça" **TODA** a aplicação. Sua única responsabilidade é carregar provedores globais (como `FirebaseClientProvider`), fontes e estilos globais.
*   **A REGRA DE OURO:** Este arquivo **NUNCA, JAMAIS, EM HIPÓTESE ALGUMA** deve conter o componente `<AuthGate>`. Colocar o `<AuthGate>` aqui trancará o site inteiro, incluindo as páginas que precisam ser públicas, quebrando a funcionalidade do chat do cliente.

```tsx
// src/app/layout.tsx - CORRETO ✅
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <FirebaseClientProvider>
          <UserProfileProvider>
            {/* O children aqui pode ser uma página pública OU o dashboard privado */}
            {children}
            <Toaster />
          </UserProfileProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
```

#### 2. A Área Privada (`/dashboard`) - O Forte Protegido

Toda a lógica de negócio do Atendente vive dentro do diretório `/dashboard`.

*   **O Guardião:** O arquivo `src/app/dashboard/layout.tsx` é o guardião de toda essa área.
*   **Como Funciona:** É **dentro deste arquivo** que o `<AuthGate>` é implementado. Ele envolve o `{children}`, garantindo que qualquer rota aninhada (ex: `/dashboard/contacts`, `/dashboard/settings`, etc.) só seja renderizada se o usuário estiver autenticado.
*   **Referência:** Como diz a documentação do `Sistema de Acesso.md`: *"Este componente 'envolve' as partes da aplicação que exigem login (como o /dashboard e todas as suas sub-páginas)."*

```tsx
// src/app/dashboard/layout.tsx - CORRETO ✅
import { AuthGate } from '@/firebase/auth-gate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // AuthGate protege TUDO que for renderizado dentro deste layout.
    <AuthGate>
      <UserProfileProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </UserProfileProvider>
    </AuthGate>
  );
}
```

#### 3. A Área Pública (`/client-chat` e o atalho `/c`) - A Porta de Entrada

A página de chat do cliente é o principal ponto de contato público.

*   **A Página Real:** A página física que contém o código do chat do cliente está em `src/app/client-chat/[brandId]/page.tsx`.
*   **O Atalho Amigável:** Para fornecer uma URL mais curta e limpa (ex: `whatsai.app/c/ID_DA_MARCA`), usamos uma "Reescrita de URL".
*   **A Configuração da Reescrita:** A "mágica" que faz o atalho `/c/` funcionar está definida no arquivo `next.config.ts`. Ele mapeia o caminho `source` para o `destination`.

```javascript
// next.config.ts - CORRETO ✅
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/c/:brandId', // O link que o usuário vê
        destination: '/client-chat/:brandId', // A página que o servidor renderiza
      },
    ];
  },
  // ... resto da config
};
```
*   **AVISO CRÍTICO:** Qualquer alteração no arquivo `next.config.ts` **exige uma reinicialização completa do servidor de desenvolvimento** para ter efeito.

---

### Manual de Manutenção - Como Fazer Alterações Sem Quebrar Nada

*   **Para PROTEGER uma nova área:**
    1.  Crie um novo diretório (ex: `/admin`).
    2.  Crie um arquivo `layout.tsx` dentro dele.
    3.  Envolva o `{children}` desse layout com o `<AuthGate>`.

*   **Para CRIAR uma nova página pública:**
    1.  Simplesmente crie o novo diretório e a página (ex: `/sobre/page.tsx`).
    2.  Não faça mais nada. Por padrão, ela será pública, pois não está dentro de um layout protegido pelo `<AuthGate>`.

*   **Se o link do chat do cliente quebrar (Erro 404):**
    1.  Verifique se a regra `rewrites` em `next.config.ts` está correta.
    2.  **Reinicie o servidor de desenvolvimento.**

Esta arquitetura é simples, robusta e segura, desde que estas regras sejam respeitadas.
