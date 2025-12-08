'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import type { Contact } from '@/lib/types';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ContactForm } from './contact-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteContact } from '@/firebase/firestore/contacts';
import { useFirestore } from '@/firebase';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps<Contact>) {
  const contact = row.original;
  const { toast } = useToast();
  const firestore = useFirestore();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteContact(firestore, contact.id);
      toast({
        title: 'Contato deletado!',
        description: `${contact.name} foi removido com sucesso.`,
      });
      setIsAlertOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar',
        description:
          error.message || 'Não foi possível deletar o contato.',
      });
    }
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onSelect={() => setIsSheetOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setIsAlertOpen(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>Editar Contato</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-grow">
            <ContactForm
              contact={contact}
              brandId={contact.brandId}
              onSuccess={() => setIsSheetOpen(false)}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente o
              contato <span className="font-bold">{contact.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
