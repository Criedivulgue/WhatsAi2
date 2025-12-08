'use client';

import { getInitialGreetingAction } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCollection, useFirestore } from '@/firebase';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  getDocs,
} from 'firebase/firestore';
import { ArrowUp, Bot, Loader2, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function ClientChatPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const firestore = useFirestore();

  const messagesQuery = useMemo(() => {
    if (!chatId) return null;
    return query(
      collection(firestore, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );
  }, [chatId, firestore]);

  const { data: messages } = useCollection<Message>(messagesQuery);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsLoading(true);
    try {
      // 1. Find contact by phone number
      const contactsRef = collection(firestore, 'contacts');
      const q = query(contactsRef, where('phone', '==', phoneNumber.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // This is a simplified flow. In a real app, you might create a new contact.
        alert('Número de telefone não encontrado.');
        setIsLoading(false);
        return;
      }
      
      const contactDoc = querySnapshot.docs[0];
      const contact = { id: contactDoc.id, ...contactDoc.data() };
      setContactId(contact.id);
      setBrandId(contact.brandId);

      // 2. Check for an existing active chat
      const chatsRef = collection(firestore, 'chats');
      const chatQuery = query(
        chatsRef,
        where('contactId', '==', contact.id),
        where('status', 'in', ['Active', 'Awaiting Return'])
      );
      const chatSnapshot = await getDocs(chatQuery);
      
      let currentChatId = '';

      if (!chatSnapshot.empty) {
        // 2a. Use existing chat
        currentChatId = chatSnapshot.docs[0].id;
      } else {
        // 2b. Create a new chat
        const newChatRef = doc(collection(firestore, 'chats'));
        const initialGreeting = await getInitialGreetingAction(phoneNumber);
        
        await setDoc(newChatRef, {
          contactId: contact.id,
          brandId: contact.brandId,
          status: 'Active',
          lastMessageTimestamp: serverTimestamp(),
          lastMessageContent: initialGreeting.greeting,
        });

        currentChatId = newChatRef.id;

        // Add the initial greeting message
        const messagesRef = collection(firestore, 'chats', currentChatId, 'messages');
        await addDoc(messagesRef, {
            sender: 'ai',
            senderId: 'ai-assistant',
            content: initialGreeting.greeting,
            timestamp: Timestamp.now()
        });
      }
      
      setChatId(currentChatId);
      setChatStarted(true);

    } catch (error) {
      console.error('Falha ao iniciar o chat', error);
      alert('Ocorreu um erro ao iniciar o chat. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !contactId || !chatId) return;

    const newMessage: Omit<Message, 'id'> = {
      sender: 'user',
      senderId: contactId,
      content: input,
      timestamp: Timestamp.now(),
    };
    
    setInput('');

    const messagesRef = collection(firestore, 'chats', chatId, 'messages');
    await addDoc(messagesRef, newMessage);

    const chatRef = doc(firestore, 'chats', chatId);
    await updateDoc(chatRef, {
        lastMessageContent: input,
        lastMessageTimestamp: serverTimestamp(),
        status: 'Active', // Mark as active on new message
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (!chatStarted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Bem-vindo ao nosso Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStartChat} className="space-y-4">
              <p className="text-center text-muted-foreground">Por favor, insira seu número de telefone para começar.</p>
              <Input
                type="tel"
                placeholder="Seu número de telefone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="text-center"
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Iniciar Chat'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center gap-4 border-b bg-card p-4">
        <Avatar>
          <AvatarImage src="https://picsum.photos/seed/brandlogo/40/40" data-ai-hint="logo abstrato" />
          <AvatarFallback>
            <Bot />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">Suporte da Marca</h2>
          <p className="text-sm text-muted-foreground">Estamos aqui para ajudar</p>
        </div>
      </header>

      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-3',
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {(message.sender === 'assistant' || message.sender === 'ai') && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot size={20} />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-[75%] rounded-lg p-3 text-sm',
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <p>{message.content}</p>
            </div>
            {message.sender === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      <footer className="border-t bg-card p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pr-12"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            disabled={!input.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
