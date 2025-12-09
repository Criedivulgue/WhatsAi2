'use client';
import { useState, useTransition, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createBrandAndUpdateUser } from '@/app/actions';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';

const onboardingFormSchema = z.object({
  brandName: z.string().min(2, 'O nome da marca é obrigatório.'),
  slogan: z.string().optional(),
  website: z.string().url('URL inválida.').optional().or(z.literal('')),
  brandDescription: z.string().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

interface OnboardingFlowProps {
  user: UserProfile;
}

export function OnboardingFlow({ user }: OnboardingFlowProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      brandName: '',
      slogan: '',
      website: '',
      brandDescription: '',
    },
  });

  useEffect(() => {
    if (user.brandName) {
      form.reset({
        brandName: user.brandName ?? '',
        slogan: user.slogan ?? '',
        website: user.website ?? '',
        brandDescription: user.brandDescription ?? '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: OnboardingFormValues) => {
    startTransition(async () => {
      try {
        await createBrandAndUpdateUser(user.uid, data);
        toast({
          title: 'Marca criada com sucesso!',
          description: 'Você será redirecionado para o seu dashboard.',
        });
        router.push('/dashboard');
      } catch (error: any) {
        console.error("Onboarding Error: ", error);
        toast({
          variant: 'destructive',
          title: 'Erro no Onboarding',
          description: error.message || 'Não foi possível completar o onboarding.',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Marca</FormLabel>
              <FormControl>
                <Input placeholder="Minha Empresa Inc." {...field} />
              </FormControl>
              <FormDescription>
                Este é o nome que será exibido publicamente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slogan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slogan (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Transformando ideias em realidade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://minhaempresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brandDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da Marca (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Somos uma empresa focada em..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Concluir Onboarding
        </Button>
      </form>
    </Form>
  );
}
