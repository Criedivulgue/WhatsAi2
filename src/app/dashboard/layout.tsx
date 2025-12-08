'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Users,
  PanelLeft,
  Settings,
  LogOut,
  Copy,
  Loader2,
} from 'lucide-react';

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { UserProfileProvider, useUserProfile } from '@/firebase/auth/user-profile-provider';

const navItems = [
  { href: '/dashboard', icon: MessageSquare, label: 'Chat' },
  { href: '/dashboard/contacts', icon: Users, label: 'Contatos' },
];

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const { toast } = useToast();
  const { user: composedUser, loading } = useUserProfile();

  const handleCopyLink = () => {
    if (composedUser?.brandId) {
      const chatLink = `${window.location.origin}/c/${composedUser.brandId}`;
      navigator.clipboard.writeText(chatLink);
      toast({
        title: 'Link Copiado!',
        description: 'O link do chat do cliente foi copiado para sua área de transferência.',
      });
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível encontrar o ID da sua marca para gerar o link.',
        variant: 'destructive',
      });
    }
  };

  const sidebarNav = (
    <TooltipProvider>
      <nav className="flex flex-col h-full gap-1 p-2">
        <div className="flex-grow">
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  size="icon"
                  className="rounded-lg"
                  aria-label={item.label}
                >
                  <Link href={item.href}>
                    <item.icon className="size-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={pathname.startsWith('/dashboard/settings') ? 'default' : 'ghost'}
                size="icon"
                className="rounded-lg"
                aria-label="Configurações"
              >
                <Link href="/dashboard/settings">
                  <Settings className="size-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Configurações
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Sair"
                onClick={() => auth.signOut()}
              >
                <Link href="/">
                  <LogOut className="size-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Sair
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <Link
          href="/dashboard"
          className="flex h-14 items-center justify-center bg-primary shrink-0"
        >
          <Logo className="h-8 w-8 text-primary-foreground" />
        </Link>
        {sidebarNav}
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Alternar Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                 <Link
                  href="/dashboard"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">WhatsAi</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-4 px-2.5 ${
                      pathname === item.href
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname.startsWith('/dashboard/settings')
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Configurações
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
             <Button variant="outline" onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copiar link do chat
            </Button>
          </div>
          <Avatar>
            {loading ? (
              <AvatarFallback><Loader2 className="animate-spin"/></AvatarFallback>
            ) : (
              <>
                <AvatarImage src={composedUser?.avatarUrl} alt="User avatar" />
                <AvatarFallback>{composedUser?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </>
            )}
          </Avatar>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProfileProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </UserProfileProvider>
  );
}
