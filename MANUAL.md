# Manual da Aplicação: WhatsAi

## 1. Objetivo Principal

O WhatsAi é uma plataforma completa e inteligente de gerenciamento de contatos e atendimento ao cliente via chat. O objetivo principal é centralizar a comunicação, otimizar o tempo dos atendentes e enriquecer o relacionamento com os clientes através do uso estratégico de Inteligência Artificial. A aplicação foi desenhada para ser intuitiva, poderosa e adaptável às necessidades de cada marca.

## 2. Funcionalidades Principais

O WhatsAi é composto por um ecossistema de funcionalidades que se integram para oferecer uma experiência de atendimento e gestão de alto nível.

### 2.1. Fluxo de Onboarding Guiado

Para garantir que cada usuário extraia o máximo da plataforma desde o primeiro dia, o WhatsAi implementa um fluxo de onboarding obrigatório e intuitivo.

- **Coleta de Informações da Marca:** O usuário insere o nome da marca, descreve seu tom de voz (ex: "amigável e profissional", "formal e direto") e define regras de comunicação (ex: "nunca oferecer descontos não aprovados").
- **Detalhes do Atendente:** Coleta de informações básicas do atendente para personalizar a experiência.
- **Configuração da IA:** O usuário pode definir o comportamento padrão do assistente de IA, como ativar resumos automáticos de conversas, sugestões de enriquecimento de perfil e geração de follow-ups.
- **Geração de Meta Tags:** Com base nas informações da marca, o sistema gera automaticamente as meta tags Open Graph (OG) para o chat do cliente, garantindo que o link do chat, quando compartilhado, exiba uma pré-visualização profissional e informativa em redes sociais e aplicativos de mensagem.

### 2.2. Gerenciamento de Contatos (CRM)

O coração do WhatsAi é um sistema robusto para organizar, editar e analisar contatos.

- **Visão Unificada:** Todos os contatos são listados em uma interface clara e organizada, com informações essenciais visíveis de imediato.
- **Importação e Adição:** É possível importar listas de contatos existentes ou adicionar novos manualmente.
- **Edição Completa:** Cada perfil de contato pode ser editado para adicionar/alterar nome, e-mail, telefone, status, categorias, interesses e notas internas.
- **Armazenamento Seguro:** Todos os dados dos contatos e seus metadados são armazenados de forma segura no Firestore.

### 2.3. Interface de Chat para Atendentes

O dashboard principal oferece um ambiente de chat projetado para máxima eficiência.

- **Visualização Lado a Lado:** A tela é dividida em três painéis: lista de chats, janela de conversa ativa e painel de informações do contato.
- **Atualizações em Tempo Real:** As mensagens são atualizadas em tempo real, sem a necessidade de recarregar a página.
- **Gerenciamento de IA:** O atendente pode ativar ou desativar o suporte da IA diretamente na interface de chat.
- **Edição Inline:** O painel do contato permite edições rápidas sem sair da tela de chat, mantendo o foco na conversa.

### 2.4. Resumo de Conversa com IA

Ao final de cada interação significativa, o atendente pode solicitar à IA que gere um resumo estruturado da conversa.

- **Sumarização Automática:** A IA analisa o diálogo e cria um resumo conciso dos pontos principais.
- **Extração de Itens de Ação:** O sistema identifica e lista tarefas ou compromissos acordados durante a conversa (ex: "Enviar proposta até sexta-feira").
- **Memória Persistente:** Os resumos são salvos no histórico do cliente, permitindo que qualquer atendente futuro tenha contexto imediato sobre interações passadas.

### 2.5. Enriquecimento de Perfil com IA

Durante ou após uma conversa, a IA pode analisar o conteúdo para sugerir melhorias no perfil do contato.

- **Sugestão de Interesses e Categorias:** Com base nos tópicos discutidos, a IA sugere novos interesses (ex: "interesse em IA generativa") ou ajusta a categoria do contato (ex: de "Lead" para "Lead Qualificado").
- **Insights de Oportunidade:** A IA identifica potenciais oportunidades de negócio mencionadas na conversa.
- **Aprovação do Atendente:** As sugestões são apresentadas ao atendente, que pode aceitá-las com um clique para atualizar o perfil do contato, ou descartá-las.

### 2.6. Sugestões Inteligentes de Acompanhamento (Follow-Up)

Para otimizar o pós-atendimento, a IA gera sugestões personalizadas de follow-up.

- **Rascunhos de E-mail e WhatsApp:** Cria rascunhos de mensagens de acompanhamento, adaptados ao tom da marca e ao contexto da conversa.
- **Recomendações de Próximos Passos:** Sugere a melhor ação seguinte, como agendar uma ligação ou enviar material adicional.
- **Criação de Eventos:** Propõe a criação de eventos no Google Calendar, já com título, descrição e convidados preenchidos, para agendar reuniões ou lembretes.

### 2.7. Chat PWA para Clientes

O WhatsAi oferece uma rota de chat leve e otimizada para o cliente final, funcionando como um Progressive Web App (PWA).

- **Acesso Simplificado:** O cliente acessa através de um link e precisa apenas informar seu número de telefone para iniciar a conversa.
- **Identidade Visual da Marca:** A interface exibe as meta tags Open Graph da marca, reforçando a credibilidade.
- **Saudação Automática com IA:** Ao entrar no chat, o cliente é recebido por uma mensagem automática e amigável gerada pela IA, que o orienta sobre como proceder.
- **Mensagens em Tempo Real e Offline:** A tecnologia PWA garante uma experiência de chat fluida e com suporte para mensagens mesmo em conexões instáveis.

## 3. Guia de Uso Rápido

### Primeiros Passos: Onboarding
1.  Acesse a aplicação pela primeira vez.
2.  Preencha as informações da sua marca, tom de voz e regras.
3.  Insira seus dados como atendente.
4.  Configure as automações de IA desejadas.
5.  Ao finalizar, você será redirecionado para o dashboard principal.

### Navegando pelo Dashboard
- **Menu Lateral:** Use os ícones para navegar entre o **Chat** e a área de **Contatos**.
- **Painel de Chat:** Gerencie todas as suas conversas em andamento. Selecione um chat na lista à esquerda para abri-lo na janela central.
- **Painel de Contatos:** Visualize, edite, adicione ou importe seus contatos.

### Utilizando as Ferramentas de IA
1.  Dentro de uma conversa ativa, no painel direito (Perfil do Contato), localize a seção "Ferramentas do Assistente de IA".
2.  Use as abas para:
    - **Resumo:** Gerar um resumo e itens de ação da conversa atual.
    - **Enriquecer:** Obter sugestões de novos interesses, categorias e notas para o perfil do contato.
    - **Acompanhamento:** Gerar rascunhos de e-mail, mensagens de WhatsApp e sugestões de próximos passos.

### A Experiência do Cliente
- Compartilhe o link do seu chat PWA com seus clientes.
- Eles informarão o número de telefone e serão instantaneamente conectados a um novo chat, onde a IA fará a saudação inicial antes que um atendente assuma.
