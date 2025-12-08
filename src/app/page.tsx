'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, signInWithEmailPassword, signUpWithEmailPassword } from '@/firebase';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const { user, loading } = useUser();
  const router = useRouter(); // Although router is used by AuthGate, we keep the hook here for potential future use.
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The useEffect that automatically pushed to /dashboard has been removed.
  // AuthGate is now the single source of truth for post-authentication routing.

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await signInWithEmailPassword(email, password);
      } else {
        await signUpWithEmailPassword(email, password);
      }
      // On success, AuthGate will handle the redirection.
    } catch (error: any) {
      console.error("Authentication Error: ", error);
      let description = "Ocorreu um erro. Por favor, tente novamente.";
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          description = "E-mail ou senha inválidos. Verifique e tente novamente.";
          break;
        case 'auth/invalid-email':
          description = "O formato do e-mail é inválido.";
          break;
        case 'auth/email-already-in-use':
          description = "Este e-mail já está em uso por outra conta.";
          break;
        case 'auth/weak-password':
          description = "A senha é muito fraca. Tente uma mais forte.";
          break;
        default:
          description = error.message || description;
      }

      toast({
        title: "Acesso Negado",
        description: description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // The AuthGate will show a loader while checking user status, so this page's loader is for when user is defined but profile is still loading.
  if (loading || user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Aguarde um momento...</p>
      </div>
    );
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto mb-4">
            <Logo className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Insira seu e-mail e senha para continuar
          </p>
        </div>

        <form onSubmit={handleAuthAction} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </Button>
        </form>

        <p className="px-8 text-center text-sm text-muted-foreground">
            <button onClick={toggleMode} className="underline underline-offset-4 hover:text-primary">
                {mode === 'login' ? 'Não tem uma conta? Crie uma agora' : 'Já tem uma conta? Faça login'}
            </button>
        </p>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Ao continuar, você concorda com nossos{" "}
          <a href="/terms" className="underline underline-offset-4 hover:text-primary">
            Termos de Serviço
          </a>
          . 
        </p>
      </div>
    </main>
  );
}
