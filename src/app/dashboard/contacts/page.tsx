'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { contactConverter } from '@/firebase/converters';
import { collection, query } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { columns } from './components/columns';
import { ContactForm } from './components/contact-form';
import { DataTable } from './components/data-table';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ContactsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const contactsQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'contacts').withConverter(
        contactConverter
      )
    );
  }, [user, firestore]);

  const { data: contacts, loading: contactsLoading } = useCollection(contactsQuery);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Contatos</h2>
        <div className="flex items-center space-x-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              {/* The button is disabled only while contacts are loading */}
              <Button disabled={contactsLoading}>
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
                  userId={user?.uid}
                  onSuccess={() => setIsSheetOpen(false)}
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Pass the loading state to the now-intelligent DataTable */}
      <DataTable columns={columns} data={contacts || []} isLoading={contactsLoading} />
    </div>
  );
}
