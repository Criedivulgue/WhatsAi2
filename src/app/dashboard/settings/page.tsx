'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useDoc, useFirestore, useUser, useStorage } from '@/firebase';
import {
  updateBrandData,
  updateUserProfile,
} from '@/firebase/firestore/mutations';
import { uploadAvatar } from '@/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import type { Brand, User } from '@/lib/types';
import { doc } from 'firebase/firestore';

const brandSettingsSchema = z.object({
  brandName: z
    .string()
    .min(2, 'O nome da marca deve ter pelo menos 2 caracteres.'),
  slogan: z.string().optional(),
  brandTone: z.string().min(10, 'Por favor, descreva o tom da sua marca.'),
  hardRules: z.string().optional(),
  softRules: z.string().optional(),
  knowledgeBase: z.string().optional(),
});

const attendantSettingsSchema = z.object({
  attendantPersona: z.string().optional(),
});

const aiSettingsSchema = z.object({
  autoSummarize: z.boolean().default(true),
  autoEnrich: z.boolean().default(false),
  autoFollowUp: z.boolean().default(false),
});

type BrandSettingsFormValues = z.infer<typeof brandSettingsSchema>;
type AttendantSettingsFormValues = z.infer<typeof attendantSettingsSchema>;
type AiSettingsFormValues = z.infer<typeof aiSettingsSchema>;

export default function SettingsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userData, loading: userDataLoading } = useDoc<User>(userDocRef);

  const brandDocRef = userData?.brandId
    ? doc(firestore, 'brands', userData.brandId)
    : null;
  const { data: brandData, loading: brandDataLoading } =
    useDoc<Brand>(brandDocRef);

  const brandForm = useForm<BrandSettingsFormValues>({
    resolver: zodResolver(brandSettingsSchema),
    mode: 'onChange',
  });

  const attendantForm = useForm<AttendantSettingsFormValues>({
    resolver: zodResolver(attendantSettingsSchema),
    mode: 'onChange',
  });

  const aiForm = useForm<AiSettingsFormValues>({
    resolver: zodResolver(aiSettingsSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (brandData) {
      brandForm.reset({
        brandName: brandData.brandName,
        slogan: brandData.slogan,
        brandTone: brandData.brandTone,
        hardRules: brandData.hardRules,
        softRules: brandData.softRules,
        knowledgeBase: brandData.knowledgeBase,
      });
      // Ensure aiConfig exists before trying to access its properties
      if (brandData.aiConfig) {
        aiForm.reset({
          autoSummarize: brandData.aiConfig.autoSummarize,
          autoEnrich: brandData.aiConfig.autoEnrich,
          autoFollowUp: brandData.aiConfig.autoFollowUp,
        });
      }
    }
    if (userData) {
      attendantForm.reset({
        attendantPersona: userData.attendantPersona,
      });
    }
  }, [brandData, userData, brandForm, attendantForm, aiForm]);

  const onBrandSubmit = async (data: BrandSettingsFormValues) => {
    if (!brandData) return;
    await updateBrandData(firestore, brandData.id, data);
    toast({
      title: 'Sucesso!',
      description: 'As informações da sua marca foram atualizadas.',
    });
  };

  const onAttendantSubmit = async (data: AttendantSettingsFormValues) => {
    if (!user) return;
    await updateUserProfile(firestore, user.uid, data);
    toast({
      title: 'Sucesso!',
      description: 'Sua persona de atendente foi atualizada.',
    });
  };

  const onAiSubmit = async (data: AiSettingsFormValues) => {
    if (!brandData) return;
    await updateBrandData(firestore, brandData.id, { aiConfig: data });
    toast({
      title: 'Sucesso!',
      description: 'As configurações de IA foram atualizadas.',
    });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !storage) return;

    setIsUploading(true);
    try {
      const downloadURL = await uploadAvatar(storage, user.uid, file);
      // Directly update the user profile in Firestore
      await updateUserProfile(firestore, user.uid, { avatarUrl: downloadURL });
      toast({
        title: 'Avatar atualizado!',
        description: 'Sua nova foto de perfil foi salva.',
      });
    } catch (error) {
      console.error("Erro no upload do avatar:", error);
      toast({
        variant: 'destructive',
        title: 'Erro no Upload',
        description: 'Não foi possível enviar sua imagem. Tente novamente.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = userLoading || userDataLoading || brandDataLoading;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Informações da Marca</CardTitle>
            <CardDescription>
              Atualize a identidade, a voz e a base de conhecimento da sua marca.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...brandForm}>
              <form
                onSubmit={brandForm.handleSubmit(onBrandSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={brandForm.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Marca</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={brandForm.control}
                  name="slogan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slogan da Marca (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua frase de efeito aqui" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandForm.control}
                  name="brandTone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tom e Voz da Marca</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandForm.control}
                  name="knowledgeBase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base de Conhecimento</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[150px]" />
                      </FormControl>
                      <FormDescription>
                        Insira fatos sobre sua empresa para a IA usar.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandForm.control}
                  name="hardRules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regras Rígidas (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>Proibições para a IA.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandForm.control}
                  name="softRules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regras Flexíveis (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Diretrizes de estilo para a IA.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={brandForm.formState.isSubmitting}
                >
                  {brandForm.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Salvar Alterações da Marca
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalização do Atendente</CardTitle>
              <CardDescription>
                Defina sua foto de perfil e persona de comunicação para a IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...attendantForm}>
                <form
                  onSubmit={attendantForm.handleSubmit(onAttendantSubmit)}
                  className="space-y-4"
                >
                   <div className="space-y-2">
                      <FormLabel>Sua Foto de Perfil</FormLabel>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={userData?.avatarUrl} alt="Avatar Preview" />
                          <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="mr-2 h-4 w-4" />
                          )}
                          {isUploading ? 'Enviando...' : 'Trocar Foto'}
                        </Button>
                        <Input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleAvatarUpload}
                          accept="image/png, image/jpeg, image/gif"
                        />
                      </div>
                      <FormDescription>Clique para fazer o upload de uma nova foto.</FormDescription>
                    </div>

                  <FormField
                    control={attendantForm.control}
                    name="attendantPersona"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sua Persona (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Ex: Sou direto e uso um linguajar técnico."
                          />
                        </FormControl>
                        <FormDescription>
                          Descreva seu estilo pessoal de comunicação.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={attendantForm.formState.isSubmitting}
                  >
                    {attendantForm.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Salvar Persona
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuração da IA</CardTitle>
              <CardDescription>
                Gerencie as automações do seu assistente de IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...aiForm}>
                <form
                  onSubmit={aiForm.handleSubmit(onAiSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={aiForm.control}
                    name="autoSummarize"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Resumir Chats Automaticamente</FormLabel>
                          <FormDescription>
                            Gerar um resumo quando um chat termina.
                          </FormDescription>
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
                    control={aiForm.control}
                    name="autoEnrich"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>
                            Sugerir Enriquecimento de Perfil
                          </FormLabel>
                          <FormDescription>
                            Deixe a IA sugerir interesses e categorias.
                          </FormDescription>
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
                    control={aiForm.control}
                    name="autoFollowUp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>
                            Gerar Ideias de Acompanhamento
                          </FormLabel>
                          <FormDescription>
                            A IA irá redigir e-mails e mensagens.
                          </FormDescription>
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
                  <Button
                    type="submit"
                    disabled={aiForm.formState.isSubmitting}
                  >
                    {aiForm.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Salvar Automações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
