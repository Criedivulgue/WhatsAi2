'use client';

import ChatLayout from "@/components/chat/chat-layout";
import { useUser, useFirestore, useCollection } from "@/firebase";
import type { Chat, Contact } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export default function ChatPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const defaultLayout = [320, 480, 1];

    // Query for chats belonging to the user's brand
    const chatsQuery = useMemo(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'chats'),
            where('brandId', '==', user.uid) // Assuming brandId is the user's UID from onboarding
        );
    }, [user, firestore]);

    const { data: chatsData, loading: chatsLoading } = useCollection<Chat>(chatsQuery);

    // Query for all contacts to map to chats
    const contactsQuery = useMemo(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'contacts'),
            where('brandId', '==', user.uid)
        );
    }, [user, firestore]);

    const { data: contactsData, loading: contactsLoading } = useCollection<Contact>(contactsQuery);
    
    const [hydratedChats, setHydratedChats] = useState<Chat[]>([]);

    useEffect(() => {
        if (chatsData.length > 0 && contactsData.length > 0) {
            const contactsMap = new Map(contactsData.map(c => [c.id, c]));
            const chatsWithContact = chatsData.map(chat => ({
                ...chat,
                contact: contactsMap.get(chat.contactId)
            })).filter(chat => chat.contact); // Filter out chats with no matching contact
            
            // Sort chats by last message timestamp
            chatsWithContact.sort((a, b) => b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis());
            setHydratedChats(chatsWithContact as Chat[]);
        }
    }, [chatsData, contactsData]);

    const isLoading = userLoading || chatsLoading || contactsLoading;

    if (isLoading) {
        return <div className="flex h-full w-full items-center justify-center">Carregando chats...</div>;
    }
    
    if (!hydratedChats || hydratedChats.length === 0) {
        return <div className="flex h-full w-full items-center justify-center">Nenhum chat encontrado.</div>;
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
