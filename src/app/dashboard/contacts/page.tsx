'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import type { Contact, User } from '@/lib/types';
import { collection, query, where, doc } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ContactForm } from './components/contact-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ContactsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Get user profile to find the brandId
  const userDocRef = useMemo(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userData, loading: userDataLoading } = useDoc<User>(userDocRef);
  const brandId = userData?.brandId;

  // Query for contacts belonging to the user's brand
  const contactsQuery = useMemo(() => {
    if (!brandId) return null;
    return query(
      collection(firestore, 'contacts'),
      where('brandId', '==', brandId)
    );
  }, [brandId, firestore]);

  const { data: contactsData, loading: contactsLoading } =
    useCollection<Contact>(contactsQuery);

  const isLoading = userLoading || userDataLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Contatos</h2>
        <div className="flex items-center space-x-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button disabled={!brandId}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Contato
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle>Adicionar Novo Contato</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-grow">
                <ContactForm
                  brandId={brandId}
                  onSuccess={() => setIsSheetOpen(false)}
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {contactsLoading ? (
         <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={contactsData} />
      )}
    </div>
  );
}
