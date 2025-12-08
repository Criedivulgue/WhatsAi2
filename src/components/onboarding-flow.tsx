'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import Logo from './logo';
import { Switch } from './ui/switch';
import { useToast } from '@/hooks/use-toast';
import { createBrandAndUser } from '@/firebase/firestore/mutations';
import { useAuth, useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';

const brandSchema = z.object({
  brandName: z.string().min(2, 'O nome da marca deve ter pelo menos 2 caracteres.'),
  brandTone: z.string().min(10, 'Por favor, descreva o tom da sua marca.'),
  hardRules: z.string().optional(),
  softRules: z.string().optional(),
});

const detailsSchema = z.object({
  attendantName: z.string().min(2, 'Seu nome é obrigatório.'),
  attendantEmail: z.string().email('Endereço de e-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

const aiConfigSchema = z.object({
  autoSummarize: z.boolean().default(true),
  autoEnrich: z.boolean().default(false),
  autoFollowUp: z.boolean().default(false),
});

const formSchema = brandSchema.merge(detailsSchema).merge(aiConfigSchema);

type OnboardingFormValues = z.infer<typeof formSchema>;

const formSteps = [
  {
    title: 'Informações da Marca',
    fields: ['brandName', 'brandTone', 'hardRules', 'softRules'],
    schema: brandSchema,
  },
  {
    title: 'Seus Detalhes',
    fields: ['attendantName', 'attendantEmail', 'password'],
    schema: detailsSchema,
  },
  {
    title: 'Configuração da IA',
    fields: ['autoSummarize', 'autoEnrich', 'autoFollowUp'],
    schema: aiConfigSchema,
  },
];

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema), // Validate the entire schema on submit
    defaultValues: {
      brandName: '',
      brandTone: 'Amigável e profissional, com uma abordagem prestativa.',
      hardRules: 'Nunca prometer funcionalidades que não existem; Não usar gírias.',
      softRules: 'Usar emojis com moderação; Sempre saudar o cliente pelo nome.',
      attendantName: '',
      attendantEmail: '',
      password: '',
      autoSummarize: true,
      autoEnrich: false,
      autoFollowUp: false,
    },
    mode: 'onChange',
  });

  const { trigger, handleSubmit, getValues } = form;

  const nextStep = async () => {
    const fieldsToValidate = formSteps[step].fields as (keyof OnboardingFormValues)[];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (step < formSteps.length - 1) {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      // Get all form values to ensure data is complete
      const data = getValues();
      await createBrandAndUser(auth, firestore, data);
      toast({
        title: 'Configuração concluída!',
        description: 'Seu espaço de trabalho foi criado com sucesso.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Falha no onboarding:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na configuração',
        description: error.message || 'Não foi possível criar sua conta. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progressValue = ((step + 1) / formSteps.length) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
          <Card className="shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary rounded-full">
                  <Logo className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-headline">Bem-vindo ao WhatsAi</CardTitle>
                  <CardDescription>Vamos configurar seu espaço de trabalho.</CardDescription>
                </div>
              </div>
              <Progress value={progressValue} className="w-full" />
            </CardHeader>
            <CardContent className="min-h-[380px]">
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold font-headline">{formSteps[0].title}</h3>
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="brandTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tom e Voz da Marca</FormLabel>
                        <FormControl>
                          <Textarea placeholder="ex: Amigável e profissional..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="hardRules"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regras Rígidas (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="ex: Nunca oferecer descontos..." {...field} />
                        </FormControl>
                        <FormDescription>Proibições que a IA não pode violar.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="softRules"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regras Flexíveis (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="ex: Usar emojis com moderação..." {...field} />
                        </FormControl>
                        <FormDescription>Diretrizes de estilo que moldam a personalidade da IA.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold font-headline">{formSteps[1].title}</h3>
                  <FormField
                    control={form.control}
                    name="attendantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="attendantEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu Email de Acesso</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="voce@empresa.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sua Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold font-headline">{formSteps[2].title}</h3>
                  <FormField
                    control={form.control}
                    name="autoSummarize"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Resumir Chats Automaticamente</FormLabel>
                          <FormDescription>Gerar um resumo quando um chat termina.</FormDescription>
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
                    control={form.control}
                    name="autoEnrich"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Sugerir Enriquecimento de Perfil</FormLabel>
                          <FormDescription>Deixe a IA sugerir interesses e categorias.</FormDescription>
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
                    control={form.control}
                    name="autoFollowUp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Gerar Ideias de Acompanhamento</FormLabel>
                          <FormDescription>A IA irá redigir e-mails e mensagens.</FormDescription>
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
              {step > 0 ? (
                <Button variant="outline" onClick={prevStep} type="button">
                  Voltar
                </Button>
              ) : <div></div>}
              {step < formSteps.length - 1 ? (
                <Button onClick={nextStep} type="button">
                  Próximo
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Finalizar Configuração
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
