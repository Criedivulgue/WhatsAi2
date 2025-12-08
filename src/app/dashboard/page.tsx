import ChatLayout from "@/components/chat/chat-layout";
import { mockChats, mockContacts } from "@/lib/data";

export default function ChatPage() {
    // In a real app, you'd fetch chats for the logged-in user
    const chats = mockChats;
    const defaultLayout = [320, 480, 1]; // Default layout widths: chat list, chat window, contact panel

    return (
        <div className="h-[calc(100vh-theme(spacing.16))]">
            <ChatLayout
                defaultLayout={defaultLayout}
                navCollapsedSize={8}
                chats={chats}
            />
        </div>
    );
}
