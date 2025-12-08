'use client';

import { getInitialGreetingAction } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCollection, useDoc, useFirestore } from '@/firebase';
import type { Message, Brand, User } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
import { ArrowUp, Bot, Loader2, User as UserIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function ClientChatPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(-1);
  const [chatStarted, setChatStarted] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const firestore = useFirestore();
  const params = useParams();
  const brandId = params.brandId as string;

  // Since brandId is the attendant's UID, we can fetch attendant data
  const attendantUserRef = useMemo(() => {
    if (!brandId) return null;
    return doc(firestore, 'users', brandId);
  }, [brandId, firestore]);
  const { data: attendantData, loading: attendantLoading } = useDoc<User>(attendantUserRef);


  const brandRef = useMemo(() => {
    if (!brandId) return null;
    return doc(firestore, 'brands', brandId);
  }, [brandId, firestore]);
  const { data: brandData, loading: brandLoading } = useDoc<Brand>(brandRef);

  const messagesQuery = useMemo(() => {
    if (!chatId) return null;
    return query(
      collection(firestore, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );
  }, [chatId, firestore]);

  const { data: messages } = useCollection<Message>(messagesQuery);
  const userAvatar = PlaceHolderImages[0];

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || !brandId || !brandData) return;

    setIsLoading(true);
    try {
      // 1. Find contact by phone number and brandId
      const contactsRef = collection(firestore, 'contacts');
      const q = query(contactsRef, where('phone', '==', phoneNumber.trim()), where('brandId', '==', brandId));
      const querySnapshot = await getDocs(q);

      let contactDoc;
      if (querySnapshot.empty) {
        // For simplicity, we create a new contact if one doesn't exist.
        // A real app might have a more complex flow here.
        const newContactRef = doc(collection(firestore, 'contacts'));
        await setDoc(newContactRef, {
            name: `Novo Contato (${phoneNumber.slice(-4)})`,
            phone: phoneNumber.trim(),
            brandId: brandId,
            contactType: 'Lead',
            avatar: `avatar-${Math.floor(Math.random() * 6) + 1}`,
            categories: [],
            interests: [],
            notes: '',
        });
        contactDoc = { id: newContactRef.id, data: () => ({ phone: phoneNumber.trim(), brandId }) };
      } else {
        contactDoc = querySnapshot.docs[0];
      }
      
      const contact = { id: contactDoc.id, ...contactDoc.data() };
      setContactId(contact.id);

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
        const initialGreeting = await getInitialGreetingAction({ 
          clientPhoneNumber: phoneNumber,
          brandTone: brandData.brandTone,
          softRules: brandData.softRules,
        });
        
        await setDoc(newChatRef, {
          contactId: contact.id,
          brandId: brandId,
          attendantId: brandId, // Assign the brand owner as the attendant
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
    const pageLoading = brandLoading || attendantLoading;
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        {pageLoading ? (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        ) : (
        <Card className="w-full max-w-md shadow-lg overflow-hidden">
          <CardHeader className="bg-card p-6 flex flex-col items-center text-center">
            <Avatar className='h-24 w-24 mb-4 border-4 border-white shadow-md'>
                <AvatarImage src={userAvatar.imageUrl} alt={attendantData?.name} data-ai-hint={userAvatar.imageHint} />
                <AvatarFallback className="text-3xl">{attendantData?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{brandData?.brandName}</CardTitle>
            <CardDescription className="text-base">{attendantData?.name}</CardDescription>
            <p className="text-sm text-muted-foreground mt-2 px-4">{brandData?.brandTone}</p>
          </CardHeader>
          <CardContent className='p-6 bg-white'>
            <form onSubmit={handleStartChat} className="space-y-4">
              <p className="text-center text-muted-foreground">Insira seu número de telefone para iniciar a conversa.</p>
              <Input
                type="tel"
                placeholder="(xx) xxxxx-xxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="text-center text-lg"
              />
              <Button type="submit" className="w-full !mt-6" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Iniciar Conversa'}
              </Button>
            </form>
          </CardContent>
        </Card>
        )}
      </main>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center gap-4 border-b bg-card p-4">
        <Avatar>
          <AvatarImage src={userAvatar.imageUrl} data-ai-hint={userAvatar.imageHint} />
          <AvatarFallback>
            <Bot />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{brandData?.brandName || "Suporte"}</h2>
          <p className="text-sm text-muted-foreground">Atendente: {attendantData?.name}</p>
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
            {(message.sender === 'attendant' || message.sender === 'ai') && (
              <Avatar className="h-8 w-8">
                 <AvatarImage src={userAvatar.imageUrl} data-ai-hint={userAvatar.imageHint} />
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
                  <UserIcon size={20} />
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
