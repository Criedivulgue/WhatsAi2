'use client';

import ChatLayout from "@/components/chat/chat-layout";
import { useUser, useFirestore, useCollection } from "@/firebase";
import type { Chat } from "@/lib/types";
import {
  collection,
  query,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { chatConverter, contactConverter } from "@/firebase/converters"; // Import centralized converters

export default function ChatPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const defaultLayout = [320, 480, 1];

    // Correctly typed query for the user's chats subcollection
    const chatsQuery = useMemo(() => {
        if (!user) return null;
        const chatColRef = collection(firestore, 'users', user.uid, 'chats').withConverter(chatConverter);
        return query(chatColRef);
    }, [user, firestore]);

    const { data: chatsData, loading: chatsLoading } = useCollection(chatsQuery);

    // Correctly typed query for the user's contacts subcollection
    const contactsQuery = useMemo(() => {
        if (!user) return null;
        const contactColRef = collection(firestore, 'users', user.uid, 'contacts').withConverter(contactConverter);
        return query(contactColRef);
    }, [user, firestore]);

    const { data: contactsData, loading: contactsLoading } = useCollection(contactsQuery);
    
    const [hydratedChats, setHydratedChats] = useState<Chat[]>([]);

    useEffect(() => {
        if (chatsData && contactsData) {
            const contactsMap = new Map(contactsData.map(c => [c.id, c]));
            const chatsWithContact = chatsData.map(chat => ({
                ...chat,
                contact: contactsMap.get(chat.contactId)
            })).filter(chat => !!chat.contact); // Ensure contact exists
            
            chatsWithContact.sort((a, b) => {
                const timeA = a.lastMessageTimestamp?.toMillis() || 0;
                const timeB = b.lastMessageTimestamp?.toMillis() || 0;
                return timeB - timeA;
            });

            setHydratedChats(chatsWithContact as Chat[]);
        } else {
             setHydratedChats([]);
        }
    }, [chatsData, contactsData]);

    const isLoading = userLoading || chatsLoading || contactsLoading;

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-theme(spacing.16))] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Carregando seus dados...</p>
                </div>
            </div>
        );
    }
    
    if (!hydratedChats || hydratedChats.length === 0) {
        return (
            <div className="flex h-[calc(100vh-theme(spacing.16))] w-full items-center justify-center">
                 <div className="text-center">
                    <h3 className="text-2xl font-bold tracking-tight">Nenhum chat encontrado</h3>
                    <p className="text-muted-foreground">
                        Quando um cliente iniciar uma conversa, ela aparecerá aqui.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-theme(spacing.16))]">
            <ChatLayout
                defaultLayout={defaultLayout}
                navCollapsedSize={8}
                chats={hydratedChats}
            />
        </div>
    );
}
