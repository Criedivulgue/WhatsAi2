'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import Logo from './logo';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const brandSchema = z.object({
  brandName: z.string().min(2, 'O nome da marca deve ter pelo menos 2 caracteres.'),
  brandTone: z.string().min(10, 'Por favor, descreva o tom da sua marca.'),
  brandRules: z.string().optional(),
});

const detailsSchema = z.object({
  attendantName: z.string().min(2, 'Seu nome é obrigatório.'),
  attendantEmail: z.string().email('Endereço de e-mail inválido.'),
});

const aiConfigSchema = z.object({
  autoSummarize: z.boolean().default(true),
  autoEnrich: z.boolean().default(false),
  autoFollowUp: z.boolean().default(false),
});

const formSchemas = [brandSchema, detailsSchema, aiConfigSchema];

type OnboardingFormValues = z.infer<typeof brandSchema> &
  z.infer<typeof detailsSchema> &
  z.infer<typeof aiConfigSchema>;

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const currentSchema = formSchemas[step];
  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      brandName: '',
      brandTone: '',
      brandRules: '',
      attendantName: '',
      attendantEmail: '',
      autoSummarize: true,
      autoEnrich: false,
      autoFollowUp: false,
    },
  });

  const { handleSubmit, trigger } = methods;

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (step < formSchemas.length - 1) {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const onSubmit = (data: OnboardingFormValues) => {
    console.log('Dados de integração:', data);
    // Aqui você normalmente salvaria os dados no seu backend
    router.push('/dashboard');
  };

  const progressValue = ((step + 1) / formSchemas.length) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
          <Card className="shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-primary rounded-full">
                    <Logo className="h-8 w-8 text-primary-foreground" />
                 </div>
                 <div>
                    <CardTitle className="text-2xl">Bem-vindo ao WhatsAi</CardTitle>
                    <CardDescription>Vamos configurar seu espaço de trabalho.</CardDescription>
                 </div>
              </div>
              <Progress value={progressValue} className="w-full" />
            </CardHeader>
            <CardContent>
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações da Marca</h3>
                  <FormField
                    control={methods.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Sua Empresa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="brandTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tom e Voz da Marca</FormLabel>
                        <FormControl>
                          <Textarea placeholder="ex: Amigável e profissional, use emojis com moderação..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="brandRules"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regras Específicas (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="ex: Nunca oferecer descontos, sempre cumprimentar pelo nome..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Seus Detalhes</h3>
                  <FormField
                    control={methods.control}
                    name="attendantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="attendantEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="voce@empresa.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Configuração da IA</h3>
                  <FormField
                    control={methods.control}
                    name="autoSummarize"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Resumir Chats Automaticamente</FormLabel>
                          <CardDescription>Gerar automaticamente um resumo quando um chat termina.</CardDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={methods.control}
                    name="autoEnrich"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Sugerir Enriquecimento de Perfil</FormLabel>
                           <CardDescription>Deixe a IA sugerir novos interesses e categorias para contatos.</CardDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={methods.control}
                    name="autoFollowUp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Gerar Ideias de Acompanhamento</FormLabel>
                          <CardDescription>A IA irá redigir e-mails e mensagens de acompanhamento para você.</CardDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 0 && (
                <Button variant="outline" onClick={prevStep} type="button">
                  Voltar
                </Button>
              )}
              {step < formSchemas.length - 1 ? (
                <Button onClick={nextStep} type="button" className={step === 0 ? 'ml-auto' : ''}>
                  Próximo
                </Button>
              ) : (
                <Button type="submit">Finalizar Configuração</Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}
