'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, uploadFileToStorage } from '@/firebase';
import { createBrandAndUserProfile } from '@/firebase/firestore/mutations';
import { Loader2, Upload } from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import type { UserProfileData } from '@/lib/types';

export default function OnboardingPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<UserProfileData>>({
    publicName: '',
    slogan: '',
    city: '',
    state: '',
    whatsappNumber: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (userLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.publicName || !formData.whatsappNumber) {
      toast({
        title: 'Campos Obrigatórios',
        description: 'Por favor, preencha pelo menos o nome da marca e o WhatsApp.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let avatarUrl = '';
      if (avatarFile) {
        // CORRECTED: Swapped arguments to match the function signature `uploadFileToStorage(file, path)`.
        avatarUrl = await uploadFileToStorage(avatarFile, `avatars/${user.uid}`);
      }

      const finalProfileData: UserProfileData = {
        publicName: formData.publicName || '',
        slogan: formData.slogan || '',
        avatarUrl: avatarUrl,
        city: formData.city || '',
        state: formData.state || '',
        whatsappNumber: formData.whatsappNumber || '',
      };

      await createBrandAndUserProfile(firestore, user.uid, finalProfileData);

      toast({
        title: 'Bem-vindo(a)!',
        description: 'Seu perfil de marca foi criado com sucesso.',
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error("Onboarding Error: ", error);
      toast({
        title: 'Erro ao Criar Perfil',
        description: `Não foi possível salvar seus dados. Erro: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto mb-4">
            <Logo className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Configure Sua Marca</h1>
          <p className="text-sm text-muted-foreground">
            Complete seu perfil para que nosso assistente possa atender seus clientes.
          </p>
        </div>

        <form onSubmit={handleOnboardingSubmit} className="space-y-4">
          {/* Avatar Input */}
          <div className="grid gap-2">
            <Label>Avatar da Marca</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar Preview" width={80} height={80} className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <Button asChild variant="outline">
                <Label htmlFor="avatar-upload" className="cursor-pointer">Selecionar Imagem</Label>
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="publicName">Nome da Marca</Label>
              <Input id="publicName" placeholder="O nome do seu negócio" value={formData.publicName ?? ''} onChange={handleInputChange} required disabled={isSubmitting} />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="slogan">Slogan</Label>
              <Input id="slogan" placeholder="Uma frase que descreve sua marca" value={formData.slogan ?? ''} onChange={handleInputChange} disabled={isSubmitting} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" placeholder="Ex: São Paulo" value={formData.city ?? ''} onChange={handleInputChange} disabled={isSubmitting} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">Estado</Label>
              <Input id="state" placeholder="Ex: SP" value={formData.state ?? ''} onChange={handleInputChange} disabled={isSubmitting} />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="whatsappNumber">WhatsApp</Label>
              <Input id="whatsappNumber" placeholder="+55 11 99999-9999" value={formData.whatsappNumber ?? ''} onChange={handleInputChange} required disabled={isSubmitting} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar e Ir para o Dashboard
          </Button>
        </form>
      </div>
    </main>
  );
}
