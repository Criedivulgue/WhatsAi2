'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCollection, useDoc, useFirestore, useUser } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Chat, Message, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { ArrowUp } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface ChatWindowProps {
  chat: Chat;
}

export function ChatWindow({ chat }: ChatWindowProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const userDocRef = useMemo(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userData } = useDoc<User>(userDocRef);

  const messagesQuery = useMemo(() => {
    if (!chat) return null;
    return query(
      collection(firestore, 'chats', chat.id, 'messages'),
      orderBy('timestamp', 'asc')
    );
  }, [chat, firestore]);

  const { data: messages, loading } = useCollection<Message>(messagesQuery);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !chat) return;

    const newMessage: Omit<Message, 'id'> = {
      sender: 'attendant',
      senderId: user.uid,
      content: input,
      timestamp: Timestamp.now(),
      // avatar is not stored in the message doc itself, it's on the user/contact profile
    };

    setInput('');

    const chatRef = doc(firestore, 'chats', chat.id);
    const messagesRef = collection(firestore, 'chats', chat.id, 'messages');

    // Add new message and update the last message info on the chat doc
    await addDoc(messagesRef, newMessage);
    await updateDoc(chatRef, {
        lastMessageContent: input,
        lastMessageTimestamp: serverTimestamp(),
    });
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-4 border-b bg-card p-4">
        <h2 className="text-xl font-bold">{chat.contact?.name}</h2>
      </header>
      <div ref={scrollAreaRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {loading && <p>Carregando mensagens...</p>}
        {messages.map((message) => {
          const contactAvatar = PlaceHolderImages.find((p) => p.id === chat.contact?.avatar);
          const isUser = message.sender === 'attendant';

          return (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-4',
                isUser ? 'flex-row-reverse' : ''
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={isUser ? userData?.avatarUrl : contactAvatar?.imageUrl}
                  alt={message.sender}
                />
                <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'max-w-[75%] rounded-lg p-3 text-sm',
                  isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                <p>{message.content}</p>
                 <p className="text-xs mt-1 opacity-50">
                  {message.timestamp?.toDate().toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <footer className="border-t bg-card p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="pr-12"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
            disabled={!input.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
