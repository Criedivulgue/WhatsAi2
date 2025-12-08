'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Contact } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { addContact, updateContact } from '@/firebase/firestore/contacts';
import { useEffect } from 'react';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const contactFormSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório.'),
  email: z.string().email('Email inválido.').optional().or(z.literal('')),
  phone: z.string().regex(phoneRegex, 'Número de telefone inválido.'),
  contactType: z.enum([
    'Lead',
    'Prospect',
    'Client',
    'VIP',
    'Past Client',
  ]),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  contact?: Contact;
  brandId?: string;
  onSuccess?: () => void;
}

export function ContactForm({ contact, brandId, onSuccess }: ContactFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const isEditMode = !!contact;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      contactType: 'Lead',
      notes: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        contactType: contact.contactType,
        notes: contact.notes,
      });
    }
  }, [contact, isEditMode, form]);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      if (isEditMode) {
        await updateContact(firestore, contact.id, data);
        toast({
          title: 'Contato atualizado!',
          description: `${data.name} foi atualizado com sucesso.`,
        });
      } else {
        if (!brandId) throw new Error('ID da marca não encontrado.');
        await addContact(firestore, brandId, data);
        toast({
          title: 'Contato adicionado!',
          description: `${data.name} foi adicionado à sua lista.`,
        });
      }
      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível salvar o contato.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome do contato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Opcional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contato@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+55 11 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Contato</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Client">Cliente</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Past Client">Ex-Cliente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anotações (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Qualquer informação relevante..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Salvar Alterações' : 'Adicionar Contato'}
        </Button>
      </form>
    </Form>
  );
}
