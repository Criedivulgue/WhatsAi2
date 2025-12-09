'use client';

import ChatLayout from "@/components/chat/chat-layout";
import { useUser, useFirestore, useCollection } from "@/firebase";
import type { Chat, Contact } from "@/lib/types";
import {
  collection,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { chatConverter, contactConverter } from "@/firebase/converters";

export default function ChatPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const defaultLayout = [320, 480, 1];

    // This composite query now correctly filters by BOTH brand and attendant.
    // This satisfies Firestore security rules that likely require brand-level scoping.
    const chatsQuery = useMemo(() => {
        if (!user?.uid || !user?.brandId) return null;
        const chatColRef = collection(firestore, 'chats').withConverter(chatConverter);
        return query(chatColRef, 
            where("brandId", "==", user.brandId), 
            where("attendantId", "==", user.uid)
        );
    }, [user, firestore]);

    const [chatsSnapshot, chatsLoading, chatsError] = useCollection<Chat>(chatsQuery);

    // This query correctly finds all contacts belonging to the user's brand.
    const contactsQuery = useMemo(() => {
        if (!user?.brandId) return null;
        const contactColRef = collection(firestore, 'contacts').withConverter(contactConverter);
        return query(contactColRef, where("brandId", "==", user.brandId));
    }, [user, firestore]);

    const [contactsSnapshot, contactsLoading, contactsError] = useCollection<Contact>(contactsQuery);
    
    const [hydratedChats, setHydratedChats] = useState<Chat[]>([]);

    useEffect(() => {
        if (chatsSnapshot && contactsSnapshot) {
            const chatsData = chatsSnapshot.docs.map(doc => doc.data());
            const contactsData = contactsSnapshot.docs.map(doc => doc.data());

            const contactsMap = new Map(contactsData.map((c: Contact) => [c.id, c]));
            
            const chatsWithContact = chatsData.map((chat: Chat) => ({
                ...chat,
                contact: contactsMap.get(chat.contactId)
            })).filter((chat): chat is Chat & { contact: Contact } => !!chat.contact);
            
            chatsWithContact.sort((a, b) => {
                const timeA = a.lastMessageTimestamp?.toMillis() || 0;
                const timeB = b.lastMessageTimestamp?.toMillis() || 0;
                return timeB - timeA;
            });

            setHydratedChats(chatsWithContact);
        } else {
             setHydratedChats([]);
        }
    }, [chatsSnapshot, contactsSnapshot]);

    const isLoading = userLoading || chatsLoading || contactsLoading;

    if (chatsError || contactsError) {
        console.error("Error loading data:", chatsError || contactsError);
    }

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
