import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Converse conosco - WhatsAi',
  description: 'Conecte-se conosco em tempo real através do nosso chat seguro.',
  openGraph: {
    title: 'Chat ao vivo - Powered by WhatsAi',
    description: 'Tem uma pergunta? Converse com nossa equipe ao vivo.',
    images: [
      {
        url: 'https://picsum.photos/seed/whatsaichat/1200/630',
        width: 1200,
        height: 630,
        alt: 'Uma interface de conversa de chat amigável.',
      },
    ],
  },
};

export default function ClientChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
