'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Chat } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface ChatListProps {
  isCollapsed: boolean;
  chats: Chat[];
  selectedChat: Chat;
  setSelectedChat: (chat: Chat) => void;
}

export function ChatList({
  isCollapsed,
  chats,
  selectedChat,
  setSelectedChat,
}: ChatListProps) {
  return (
    <div className="flex h-full flex-col bg-card">
      <div className="p-4">
        <h2
          className={cn(
            'text-2xl font-bold tracking-tight',
            isCollapsed && 'hidden'
          )}
        >
          Chats
        </h2>
        <div className={cn('relative mt-4', isCollapsed && 'mt-0')}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className={cn('pl-9', isCollapsed && 'hidden')}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {chats.map((chat) => {
            const avatar = PlaceHolderImages.find(p => p.id === chat.contact.avatar);
            return (
              <Button
                key={chat.id}
                variant={selectedChat.id === chat.id ? 'secondary' : 'ghost'}
                className="h-auto justify-start p-2 text-left"
                onClick={() => setSelectedChat(chat)}
              >
                <Avatar className="flex items-center justify-center">
                  <AvatarImage
                    src={avatar?.imageUrl}
                    alt={chat.contact.name}
                    width={6}
                    height={6}
                    className="h-8 w-8"
                    data-ai-hint={avatar?.imageHint}
                  />
                  <AvatarFallback>
                    {chat.contact.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'ml-3 w-full max-w-40 space-y-1',
                    isCollapsed && 'hidden'
                  )}
                >
                  <p className="font-semibold">{chat.contact.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {chat.messages.slice(-1)[0].message}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
