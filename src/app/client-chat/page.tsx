'use client';

import { getInitialGreetingAction } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowUp, Bot, Loader2, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

export default function ClientChatPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      setIsLoading(true);
      try {
        const response = await getInitialGreetingAction(phoneNumber);
        setMessages([
          {
            id: 1,
            role: 'assistant',
            content: response.greeting,
          },
        ]);
        setChatStarted(true);
      } catch (error) {
        console.error('Failed to get initial greeting', error);
        setMessages([
          {
            id: 1,
            role: 'assistant',
            content: 'Hello! How can I help you today?',
          },
        ]);
        setChatStarted(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newUserMessage: Message = {
        id: messages.length + 1,
        role: 'user',
        content: input,
      };
      setMessages((prev) => [...prev, newUserMessage]);
      setInput('');
      // Simulate assistant response
      setTimeout(() => {
        const assistantResponse: Message = {
          id: messages.length + 2,
          role: 'assistant',
          content: 'Thank you for your message. An attendant will be with you shortly.',
        };
        setMessages((prev) => [...prev, assistantResponse]);
      }, 1000);
    }
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
            <CardTitle className="text-center text-2xl">Welcome to our Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStartChat} className="space-y-4">
              <p className="text-center text-muted-foreground">Please enter your phone number to begin.</p>
              <Input
                type="tel"
                placeholder="Your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="text-center"
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Start Chat'}
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
          <AvatarImage src="https://picsum.photos/seed/brandlogo/40/40" data-ai-hint="logo abstract" />
          <AvatarFallback>
            <Bot />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">Brand Support</h2>
          <p className="text-sm text-muted-foreground">We're here to help</p>
        </div>
      </header>

      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8">
                 <AvatarFallback><Bot size={20}/></AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-[75%] rounded-lg p-3 text-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <p>{message.content}</p>
            </div>
             {message.role === 'user' && (
              <Avatar className="h-8 w-8">
                 <AvatarFallback><User size={20}/></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      <footer className="border-t bg-card p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pr-12"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
