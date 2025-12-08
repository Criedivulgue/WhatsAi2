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
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/dashboard', icon: MessageSquare, label: 'Chat' },
  { href: '/dashboard/contacts', icon: Users, label: 'Contatos' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages[0];
  const { user } = useUser();
  const { toast } = useToast();

  const handleCopyLink = () => {
    if (user) {
      const chatLink = `${window.location.origin}/client-chat/${user.uid}`;
      navigator.clipboard.writeText(chatLink);
      toast({
        title: 'Link Copiado!',
        description: 'O link do chat do cliente foi copiado para sua área de transferência.',
      });
    }
  };

  const mainNav = (
    <nav className="grid gap-1 p-2">
      <TooltipProvider>
        {navItems.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={pathname.startsWith(item.href) && !pathname.startsWith(`${item.href}/`) ? 'default' : 'ghost'}
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
      </TooltipProvider>
    </nav>
  );

  const footerNav = (
    <nav className="mt-auto grid gap-1 p-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant={pathname.startsWith('/dashboard/settings') ? 'default' : 'ghost'}
              size="icon"
              className="mt-auto rounded-lg"
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
      </TooltipProvider>
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <Link
          href="/dashboard"
          className="flex h-14 items-center justify-center bg-primary"
        >
          <Logo className="h-8 w-8 text-primary-foreground" />
        </Link>
        {mainNav}
        {footerNav}
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
                      pathname.startsWith(item.href)
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
            <AvatarImage src={userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint} />
            <AvatarFallback>UA</AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
