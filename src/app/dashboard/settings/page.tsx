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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useStorage } from '@/firebase'; 
import { useUserProfile } from '@/firebase/auth/user-profile-provider';
import {
  updateBrandData,
  updateUserProfile,
} from '@/firebase/firestore/mutations';
import { uploadAvatar } from '@/firebase/storage';
import { useToast } from '@/hooks/use-toast';

const brandIdentitySchema = z.object({
  brandName: z.string().min(2, 'O nome da marca deve ter pelo menos 2 caracteres.'),
  slogan: z.string().optional(),
  attendantPersona: z.string().optional(),
  brandTone: z.string().min(10, 'Por favor, descreva o tom da sua marca.'),
  hardRules: z.string().optional(),
  softRules: z.string().optional(),
  knowledgeBase: z.string().optional(),
});

const aiSettingsSchema = z.object({
  autoSummarize: z.boolean().default(true),
  autoEnrich: z.boolean().default(false),
  autoFollowUp: z.boolean().default(false),
});

type BrandIdentityFormValues = z.infer<typeof brandIdentitySchema>;
type AiSettingsFormValues = z.infer<typeof aiSettingsSchema>;

export default function SettingsPage() {
  const { user: composedUser, loading: userLoading } = useUserProfile();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const identityForm = useForm<BrandIdentityFormValues>({
    resolver: zodResolver(brandIdentitySchema),
    mode: 'onChange',
  });

  const aiForm = useForm<AiSettingsFormValues>({
    resolver: zodResolver(aiSettingsSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (composedUser) {
      identityForm.reset({
        brandName: composedUser.brandName || '',
        slogan: composedUser.slogan || '',
        brandTone: composedUser.brandTone || '',
        hardRules: composedUser.hardRules || '',
        softRules: composedUser.softRules || '',
        knowledgeBase: composedUser.knowledgeBase || '',
        attendantPersona: composedUser.attendantPersona || '',
      });
      if (composedUser.aiConfig) {
        aiForm.reset(composedUser.aiConfig);
      }
    }
  }, [composedUser, identityForm, aiForm]);

  const onIdentitySubmit = async (data: BrandIdentityFormValues) => {
    if (!composedUser || !firestore) return;
    const { attendantPersona, ...brandDetails } = data;
    
    await Promise.all([
      updateBrandData(firestore, composedUser.brandId, brandDetails),
      updateUserProfile(firestore, composedUser.id, { attendantPersona }),
    ]);
    
    toast({ title: 'Sucesso!', description: 'A identidade da sua marca foi atualizada.' });
  };

  const onAiSubmit = async (data: AiSettingsFormValues) => {
    if (!composedUser || !firestore) return;
    await updateBrandData(firestore, composedUser.brandId, { aiConfig: data });
    toast({ title: 'Sucesso!', description: 'As configurações de IA foram atualizadas.' });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCancelUpload = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile || !composedUser || !storage || !firestore) return;

    setIsUploading(true);
    try {
      const downloadURL = await uploadAvatar(storage, composedUser.id, avatarFile);
      await updateUserProfile(firestore, composedUser.id, { avatarUrl: downloadURL });
      
      setAvatarPreview(null); 
      setAvatarFile(null); 
      if (fileInputRef.current) fileInputRef.current.value = '';

      toast({
        title: 'Avatar atualizado!',
        description: 'A nova imagem da sua marca foi salva e já está visível em toda a aplicação.',
      });

    } catch (error) {
      console.error("Erro no upload do avatar:", error);
      handleCancelUpload(); 
      toast({
        variant: 'destructive',
        title: 'Erro no Upload',
        description: 'Não foi possível enviar sua imagem. Tente novamente.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const avatarSrc = avatarPreview || composedUser?.avatarUrl;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Configurações da Marca</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Identidade da Marca</CardTitle>
            <CardDescription>Defina o rosto, a voz, o conhecimento e as regras da sua marca.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...identityForm}>
              <form onSubmit={identityForm.handleSubmit(onIdentitySubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label>Avatar da Marca</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarSrc || undefined} alt="Avatar da Marca" />
                      <AvatarFallback>{composedUser?.brandName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    {!avatarFile ? (
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Trocar Imagem
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button type="button" onClick={handleSaveAvatar} disabled={isUploading}>
                          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          {isUploading ? 'Salvando...' : 'Salvar Novo Avatar'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={handleCancelUpload} disabled={isUploading}>Cancelar</Button>
                      </div>
                    )}
                    <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" />
                  </div>
                  <FormDescription>Clique para fazer o upload de uma nova imagem para a marca.</FormDescription>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={identityForm.control} name="brandName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Marca</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField control={identityForm.control} name="slogan" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slogan</FormLabel>
                        <FormControl><Input placeholder="Sua frase de efeito aqui" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>

                <FormField control={identityForm.control} name="attendantPersona" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Persona do Atendente (Voz da Marca)</FormLabel>
                      <FormControl><Textarea {...field} placeholder="Ex: Sou direto e uso um linguajar técnico." /></FormControl>
                      <FormDescription>Descreva o estilo de comunicação da sua marca.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                <FormField control={identityForm.control} name="brandTone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tom e Voz da Marca</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                
                <FormField control={identityForm.control} name="knowledgeBase" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base de Conhecimento</FormLabel>
                      <FormControl><Textarea {...field} className="min-h-[150px]" /></FormControl>
                      <FormDescription>Insira fatos sobre sua empresa para a IA usar.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                <FormField control={identityForm.control} name="hardRules" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regras Rígidas (Opcional)</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormDescription>Proibições para a IA.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                <FormField control={identityForm.control} name="softRules" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regras Flexíveis (Opcional)</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormDescription>Diretrizes de estilo para a IA.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                <Button type="submit" disabled={identityForm.formState.isSubmitting}>
                  {identityForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Automações da IA</CardTitle>
            <CardDescription>Gerencie os recursos inteligentes do seu assistente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...aiForm}>
              <form onSubmit={aiForm.handleSubmit(onAiSubmit)} className="space-y-6">
                <FormField control={aiForm.control} name="autoSummarize" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Resumir Chats</FormLabel>
                        <FormDescription>Gerar um resumo quando um chat termina.</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                <FormField control={aiForm.control} name="autoEnrich" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Sugerir Enriquecimento</FormLabel>
                        <FormDescription>Deixar a IA sugerir interesses e categorias.</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                <FormField control={aiForm.control} name="autoFollowUp" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Gerar Follow-ups</FormLabel>
                        <FormDescription>A IA irá redigir e-mails e mensagens.</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                <Button type="submit" disabled={aiForm.formState.isSubmitting}>
                  {aiForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Automações
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
