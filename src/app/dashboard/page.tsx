'use client';

import ChatLayout from "@/components/chat/chat-layout";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import type { Chat, Contact, User } from "@/lib/types";
import { collection, query, where, doc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const defaultLayout = [320, 480, 1];

    // Get user profile to find the brandId
    const userDocRef = useMemo(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);
    const { data: userData, loading: userDataLoading } = useDoc<User>(userDocRef);

    // Query for chats belonging to the user's brand
    const chatsQuery = useMemo(() => {
        if (!userData?.brandId) return null;
        return query(
            collection(firestore, 'chats'),
            where('brandId', '==', userData.brandId)
        );
    }, [userData, firestore]);

    const { data: chatsData, loading: chatsLoading } = useCollection<Chat>(chatsQuery);

    // Query for all contacts to map to chats
    const contactsQuery = useMemo(() => {
        if (!userData?.brandId) return null;
        return query(
            collection(firestore, 'contacts'),
            where('brandId', '==', userData.brandId)
        );
    }, [userData, firestore]);

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

    const isLoading = userLoading || userDataLoading || chatsLoading || contactsLoading;

    if (isLoading) {
        return <div className="flex h-[calc(100vh-theme(spacing.16))] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Carregando seus dados...</p>
            </div>
        </div>;
    }
    
    if (!hydratedChats || hydratedChats.length === 0) {
        return <div className="flex h-[calc(100vh-theme(spacing.16))] w-full items-center justify-center">
             <div className="text-center">
                <h3 className="text-2xl font-bold tracking-tight">Nenhum chat encontrado</h3>
                <p className="text-muted-foreground">
                    Quando um cliente iniciar uma conversa, ela aparecerá aqui.
                </p>
            </div>
        </div>;
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
