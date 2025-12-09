'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { contactConverter } from '@/firebase/converters';
import { collection, query, where } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { columns } from './components/columns';
import { ContactForm } from './components/contact-form';
import { DataTable } from './components/data-table';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ContactsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // The query is memoized and will re-evaluate only when user or firestore instances change.
  const contactsQuery = useMemo(() => {
    // We cannot create the query until we have the user and their brandId.
    if (!user?.brandId) return null;

    // This query now correctly targets the top-level 'contacts' collection
    // and filters by the 'brandId' of the currently logged-in user.
    return query(
      collection(firestore, 'contacts').withConverter(contactConverter),
      where('brandId', '==', user.brandId)
    );
  }, [user, firestore]);

  // The useCollection hook from react-firebase-hooks returns an array [value, loading, error].
  // We destructure it accordingly. `contacts` here is a QuerySnapshot.
  const [contacts, contactsLoading] = useCollection(contactsQuery);

  // The overall loading state depends on both the user and the contacts being loaded.
  const isDataLoading = userLoading || contactsLoading;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Contatos</h2>
        <div className="flex items-center space-x-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button disabled={isDataLoading || !user?.brandId}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Contato
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle>Adicionar Novo Contato</SheetTitle>
                <SheetDescription>
                  Preencha os detalhes do novo contato aqui. Clique em salvar quando terminar.
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="flex-grow">
                {/* The ContactForm correctly receives the brandId, not a userId. */}
                <ContactForm
                  brandId={user?.brandId}
                  onSuccess={() => setIsSheetOpen(false)}
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* The data for the table is mapped from the `docs` property of the QuerySnapshot. */}
      <DataTable columns={columns} data={contacts?.docs.map(doc => doc.data()) || []} isLoading={isDataLoading} />
    </div>
  );
}
