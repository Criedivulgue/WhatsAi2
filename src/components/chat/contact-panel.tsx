'use client';

import {
  getChatSummaryAction,
  getFollowUpSuggestionsAction,
  getProfileEnrichmentsAction,
} from '@/app/actions';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useDoc, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type {
  Chat,
  Contact,
  FollowUpSuggestions,
  ProfileEnrichments,
} from '@/lib/types';
import { doc } from 'firebase/firestore';
import {
  Bot,
  BrainCircuit,
  Calendar,
  Clipboard,
  Loader2,
  Mail,
  MessageSquare,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Workflow,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface ContactPanelProps {
  chat: Chat;
}

export function ContactPanel({ chat }: ContactPanelProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const contactRef = useMemo(() => {
    if (!chat?.contactId) return null;
    return doc(firestore, 'contacts', chat.contactId);
  }, [chat?.contactId, firestore]);

  const { data: contact, loading } = useDoc<Contact>(contactRef);
  
  if (loading) {
    return (
       <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <Loader2 className="animate-spin" />
        <p className="text-muted-foreground mt-2">Carregando contato...</p>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <p className="text-muted-foreground">Detalhes do contato não encontrados.</p>
      </div>
    );
  }
  const avatar = PlaceHolderImages.find((p) => p.id === contact.avatar);

  const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=Reunião+com+${encodeURIComponent(contact.name)}`;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-center border-b bg-card p-4">
        <h2 className="text-xl font-bold">Perfil do Contato</h2>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatar?.imageUrl} alt={contact.name} data-ai-hint={avatar?.imageHint} />
                <AvatarFallback className="text-2xl">
                  {contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1">
                <div className='flex justify-between items-start'>
                  <CardTitle>{contact.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <Link href={`mailto:${contact.email}`} target="_blank">
                        <Mail className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <Link href={calendarLink} target="_blank">
                        <Calendar className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardDescription>{contact.phone}</CardDescription>
                <CardDescription>{contact.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h4 className="font-semibold text-sm">Tipo de Contato</h4>
                  <Badge>{contact.contactType}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Categorias</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contact.categories.map((cat) => (
                      <Badge key={cat} variant="secondary">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Interesses</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contact.interests.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm">Anotações Internas</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {contact.notes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <AiTools chat={{...chat, contact}} />
        </div>
      </ScrollArea>
    </div>
  );
}

function AiTools({ chat }: { chat: Chat }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('summary');
  const [summary, setSummary] = useState<{ summary: string; actionItems: string[] } | null>(null);
  const [enrichments, setEnrichments] = useState<ProfileEnrichments | null>(null);
  const [followUps, setFollowUps] = useState<FollowUpSuggestions | null>(null);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleAction = async (action: () => Promise<any>, key: string) => {
    setIsLoading(prev => ({ ...prev, [key]: true }));
    try {
      const result = await action();
      if (key === 'summary') setSummary(result);
      if (key === 'enrichments') setEnrichments(result);
      if (key === 'followUps') setFollowUps(result);
    } catch (error) {
      toast({
        title: 'Erro de IA',
        description: `Falha ao gerar ${key}.`,
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const brandInfo = "Minha marca é amigável, profissional e prestativa. Usamos emojis ocasionalmente, mas evitamos gírias. Toda a comunicação deve ser clara e concisa.";

  const enrichmentSuggestions = enrichments
    ? [
        ...enrichments.suggestedInterests.map((i) => ({ type: 'Interesse', value: i })),
        ...enrichments.adjustedCategories.map((c) => ({ type: 'Categoria', value: c })),
      ]
    : [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "O conteúdo foi copiado para a área de transferência." });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          Ferramentas do Assistente de IA
        </CardTitle>
        <CardDescription>
          Use a IA para analisar esta conversa e obter insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">
              <Workflow className="mr-2 h-4 w-4" /> Resumo
            </TabsTrigger>
            <TabsTrigger value="enrichments">
              <BrainCircuit className="mr-2 h-4 w-4" /> Enriquecer
            </TabsTrigger>
            <TabsTrigger value="follow-ups">
              <Sparkles className="mr-2 h-4 w-4" /> Acompanhamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4 space-y-4">
            <Button
              onClick={() => handleAction(() => getChatSummaryAction(chat.messages.map(m => `${m.sender}: ${m.content}`).join('\n')), 'summary')}
              disabled={isLoading.summary}
              className="w-full"
            >
              {isLoading.summary ? <Loader2 className="animate-spin" /> : 'Gerar Resumo'}
            </Button>
            {summary && (
              <div className="space-y-4 rounded-md border p-4">
                <h4 className="font-semibold">Resumo da Conversa</h4>
                <p className="text-sm text-muted-foreground">{summary.summary}</p>
                <Separator />
                <h4 className="font-semibold">Itens de Ação</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {summary.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="enrichments" className="mt-4 space-y-4">
            <Button
              onClick={() => handleAction(() => getProfileEnrichmentsAction(chat), 'enrichments')}
              disabled={isLoading.enrichments}
              className="w-full"
            >
              {isLoading.enrichments ? <Loader2 className="animate-spin" /> : 'Sugerir Enriquecimentos'}
            </Button>
            {enrichments && (
              <div className="space-y-4 rounded-md border p-4">
                {enrichmentSuggestions.length > 0 && (
                  <>
                    <h4 className="font-semibold">Atualizações Sugeridas</h4>
                    <div className="space-y-2">
                      {enrichmentSuggestions.map((s, i) => (
                        <div key={i} className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-sm">
                          <span>
                            Novo {s.type}: <strong>{s.value}</strong>
                          </span>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7"><ThumbsUp className="h-4 w-4 text-green-500" /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7"><ThumbsDown className="h-4 w-4 text-red-500" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator />
                  </>
                )}
                
                <h4 className="font-semibold">Insights de Oportunidade</h4>
                <p className="text-sm text-muted-foreground">{enrichments.opportunityInsights}</p>
                <Separator />
                <h4 className="font-semibold">Anotações Internas Sugeridas</h4>
                <p className="text-sm text-muted-foreground">{enrichments.internalNotes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="follow-ups" className="mt-4 space-y-4">
            <Button
              onClick={() => handleAction(() => getFollowUpSuggestionsAction(chat, brandInfo), 'followUps')}
              disabled={isLoading.followUps}
              className="w-full"
            >
              {isLoading.followUps ? <Loader2 className="animate-spin" /> : 'Gerar Acompanhamentos'}
            </Button>
            {followUps && (
               <div className="space-y-4 rounded-md border p-4">
                  <h4 className="font-semibold">Recomendação de Acompanhamento</h4>
                  <p className="text-sm text-muted-foreground">{followUps.followUpRecommendation}</p>
                  <Separator />
                  <h4 className="font-semibold">Mensagens Sugeridas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline"><Mail className="mr-2 h-4 w-4"/> Email</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader><SheetTitle>Rascunho de Email</SheetTitle></SheetHeader>
                        <Textarea defaultValue={followUps.emailDraft} className="h-64 mt-4" readOnly />
                        <Button className="mt-4" onClick={() => copyToClipboard(followUps.emailDraft)}><Clipboard className="mr-2 h-4 w-4"/> Copiar</Button>
                      </SheetContent>
                    </Sheet>
                     <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4"/> WhatsApp</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader><SheetTitle>Mensagem de WhatsApp</SheetTitle></SheetHeader>
                        <Textarea defaultValue={followUps.whatsAppMessage} className="h-64 mt-4" readOnly />
                        <Button className="mt-4" onClick={() => copyToClipboard(followUps.whatsAppMessage)}><Clipboard className="mr-2 h-4 w-4"/> Copiar</Button>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <Separator />
                  <h4 className="font-semibold">Sugestão de Evento no Calendário</h4>
                  <p className="text-sm text-muted-foreground">{followUps.calendarEventSuggestion}</p>
               </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
