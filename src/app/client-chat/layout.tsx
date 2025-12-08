import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat with us - WhatsAi',
  description: 'Connect with us in real-time through our secure chat.',
  openGraph: {
    title: 'Live Chat - Powered by WhatsAi',
    description: 'Have a question? Chat with our team live.',
    images: [
      {
        url: 'https://picsum.photos/seed/whatsaichat/1200/630',
        width: 1200,
        height: 630,
        alt: 'A friendly chat conversation interface.',
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
