'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ChatList } from './chat-list';
import { ChatWindow } from './chat-window';
import type { Chat } from '@/lib/types';
import { ContactPanel } from './contact-panel';

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  navCollapsedSize: number;
  chats: Chat[];
}

export default function ChatLayout({
  defaultLayout = [320, 480, 1],
  navCollapsedSize,
  chats,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0] || null);

  useEffect(() => {
    // If chats list updates, make sure a chat is selected if possible
    if (!selectedChat && chats.length > 0) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat]);
  

  if (!selectedChat) {
     return <div className="flex h-full w-full items-center justify-center">Selecione um chat para começar.</div>;
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={20}
        maxSize={30}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out'
        )}
      >
        <ChatList
          isCollapsed={isCollapsed}
          chats={chats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <ChatWindow key={selectedChat.id} chat={selectedChat} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={defaultLayout[2]} minSize={25} maxSize={35}>
        <ContactPanel key={selectedChat.id} chat={selectedChat} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
