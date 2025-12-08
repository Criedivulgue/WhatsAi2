'use client';

import { useState, useRef } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { createBrandAndUser } from '@/firebase/firestore/mutations';
import { useAuth, useFirestore, useStorage } from '@/firebase';
import { Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { uploadAvatar } from '@/firebase/storage';

const brandSchema = z.object({
  brandName: z.string().min(2, 'O nome da marca deve ter pelo menos 2 caracteres.'),
  slogan: z.string().min(2, 'O slogan é obrigatório.'),
  brandTone: z.string().min(10, 'Por favor, descreva o tom da sua marca.'),
  knowledgeBase: z.string().optional(),
  hardRules: z.string().optional(),
  softRules: z.string().optional(),
});

const detailsSchema = z.object({
  attendantName: z.string().min(2, 'Seu nome é obrigatório.'),
  avatarUrl: z.string().url('Por favor, faça o upload de uma imagem de avatar.').min(1, 'Por favor, faça o upload de uma imagem de avatar.'),
  attendantEmail: z.string().email('Endereço de e-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

const aiConfigSchema = z.object({
  // These fields are for the AI settings step, but we are simplifying for now
});

const formSchema = brandSchema.merge(detailsSchema).merge(aiConfigSchema);

type OnboardingFormValues = z.infer<typeof formSchema>;

const formSteps = [
  {
    title: 'Informações da Marca',
    fields: ['brandName', 'slogan', 'brandTone', 'knowledgeBase', 'hardRules', 'softRules'],
    schema: brandSchema,
  },
  {
    title: 'Seus Detalhes',
    fields: ['attendantName', 'avatarUrl', 'attendantEmail', 'password'],
    schema: detailsSchema,
  },
  {
    title: 'Finalizando',
    fields: [],
    schema: z.object({}),
  },
];

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSteps[step].schema),
    defaultValues: {
      brandName: '',
      slogan: '',
      brandTone: 'Amigável e profissional, com uma abordagem prestativa.',
      knowledgeBase: 'Produtos: Plano Básico, Plano Pro, Plano Empresarial. Horário de Atendimento: 9h às 18h, Seg-Sex.',
      hardRules: 'Nunca prometer funcionalidades que não existem; Não usar gírias.',
      softRules: 'Usar emojis com moderação; Sempre saudar o cliente pelo nome.',
      attendantName: '',
      avatarUrl: '',
      attendantEmail: '',
      password: '',
    },
    mode: 'onChange',
  });

  const { trigger, handleSubmit, getValues, watch, setValue } = form;
  
  const avatarUrl = watch('avatarUrl');

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storage) return;

    const tempId = `onboarding-${Date.now()}`;
    setIsUploading(true);
    try {
      const downloadURL = await uploadAvatar(storage, tempId, file, 'avatars');
      setValue('avatarUrl', downloadURL, { shouldValidate: true });
      toast({
        title: 'Imagem pronta!',
        description: 'Sua imagem de avatar foi carregada.',
      });
    } catch (error) {
      console.error("Erro no upload do avatar durante onboarding:", error);
      toast({
        variant: 'destructive',
        title: 'Erro no Upload',
        description: 'Não foi possível carregar a imagem. Tente novamente.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = formSteps[step].fields as (keyof OnboardingFormValues)[];
    const isValid = await trigger(fieldsToValidate);
    if (isValid && step < formSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsSubmitting(true);
    try {
      if (!data.avatarUrl) {
          throw new Error('Por favor, faça o upload de uma imagem de avatar.');
      }
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
      setIsSubmitting(false);
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
            <CardContent className="min-h-[420px]">
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
                    name="slogan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slogan da Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Sua frase de efeito aqui" {...field} />
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
                    name="avatarUrl"
                    render={() => (
                      <FormItem>
                        <FormLabel>Sua Foto de Perfil</FormLabel>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarUrl} alt="Avatar Preview" />
                            <AvatarFallback>{getValues('attendantName')?.charAt(0) || 'A'}</AvatarFallback>
                          </Avatar>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            {isUploading ? 'Enviando...' : 'Escolher Foto'}
                          </Button>
                          <FormControl>
                            <Input 
                              type="file" 
                              ref={fileInputRef}
                              className="hidden"
                              onChange={handleAvatarUpload}
                              accept="image/png, image/jpeg, image/gif"
                            />
                          </FormControl>
                        </div>
                        <FormDescription>Faça o upload de uma foto para seu perfil.</FormDescription>
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
                 <div className="space-y-6 text-center pt-10">
                  <h3 className="text-2xl font-bold font-headline">Tudo pronto!</h3>
                  <p className="text-muted-foreground">
                    Você está pronto para começar a usar o WhatsAi. Clique no botão abaixo para ir para o seu painel.
                  </p>
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
                <Button type="submit" disabled={isSubmitting || isUploading}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Finalizar e ir para o Painel
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
