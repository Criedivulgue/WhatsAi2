'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Chat } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ChatWindowProps {
  chat: Chat;
}

export function ChatWindow({ chat }: ChatWindowProps) {
  const [messages, setMessages] = useState(chat.messages);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat.messages]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          name: 'Attendant',
          message: input,
          avatar: 'avatar-1'
        },
      ]);
      setInput('');
    }
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-4 border-b bg-card p-4">
        <h2 className="text-xl font-bold">{chat.contact.name}</h2>
      </header>
      <div ref={scrollAreaRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message, index) => {
           const avatarData = PlaceHolderImages.find(p => p.id === message.avatar);
           const isUser = message.name === 'Attendant';
          return (
            <div
              key={index}
              className={cn(
                'flex items-start gap-4',
                isUser ? 'flex-row-reverse' : ''
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarData?.imageUrl} alt={message.name} data-ai-hint={avatarData?.imageHint} />
                <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'max-w-[75%] rounded-lg p-3 text-sm',
                  isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p>{message.message}</p>
              </div>
            </div>
          )
        })}
      </div>
      <footer className="border-t bg-card p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="pr-12"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
