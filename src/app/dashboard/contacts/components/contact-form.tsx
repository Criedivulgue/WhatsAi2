'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { IMaskInput } from 'react-imask';

// Schema for form validation. Remains unchanged.
const contactFormSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório.'),
  email: z.string().email('Email inválido.').optional().or(z.literal('')),
  phone: z.string()
    .regex(/^[0-9]+$/, 'O telefone deve conter apenas números.')
    .min(10, "O telefone deve ter pelo menos 10 dígitos."),
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

// Props are updated to accept brandId and not require userId.
interface ContactFormProps {
  contact?: Contact;     // For editing existing contacts
  brandId?: string;      // For creating new contacts
  onSuccess?: () => void;  // Callback for successful submission
}

const phoneMask = [
    { mask: '(00) 0000-0000' },
    { mask: '(00) 00000-0000' },
];

// The component now uses brandId and doesn't rely on the outdated userId.
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

  // Populates the form with contact data when in edit mode.
  useEffect(() => {
    if (contact) {
      form.reset({
        name: contact.name ?? '',
        email: contact.email ?? '',
        phone: contact.phone ?? '',
        contactType: contact.contactType,
        notes: contact.notes ?? '',
      });
    }
  }, [contact, form]);

  // The submit handler now uses the correct functions and parameters.
  const onSubmit = async (data: ContactFormValues) => {
    // Check for brandId only when creating a new contact.
    if (!isEditMode && !brandId) {
        toast({
            variant: 'destructive',
            title: 'Erro de Configuração',
            description: 'O ID da marca não foi fornecido. Não é possível criar o contato.',
        });
        return;
    }

    try {
      if (isEditMode && contact) {
        // Calls updateContact with the correct parameters: contactId and form data.
        await updateContact(firestore, contact.id, data);
        toast({
          title: 'Contato atualizado!',
          description: `${data.name} foi atualizado com sucesso.`,
        });
      } else if (brandId) {
        // Calls addContact with the correct parameters: brandId and form data.
        await addContact(firestore, brandId, data);
        toast({
          title: 'Contato adicionado!',
          description: `${data.name} foi adicionado à sua lista.`
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

  const isSubmitDisabled = form.formState.isSubmitting || (isEditMode ? !contact : !brandId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
        {/* Form fields remain unchanged... */}
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
                <IMaskInput
                  mask={phoneMask}
                  value={field.value}
                  unmask={true}
                  onAccept={(value: any) => field.onChange(value)}
                  placeholder="(11) 99999-9999"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
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
        <Button type="submit" disabled={isSubmitDisabled} className="w-full">
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Salvar Alterações' : 'Adicionar Contato'}
        </Button>
      </form>
    </Form>
  );
}
