'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { Contact } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Contact>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => {
      const contact = row.original;
      const avatar = PlaceHolderImages.find((p) => p.id === contact.avatar);
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar?.imageUrl} alt={contact.name} data-ai-hint={avatar?.imageHint}/>
            <AvatarFallback>{contact.name ? contact.name.charAt(0) : '?'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{contact.name}</span>
            <span className="text-xs text-muted-foreground">{contact.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
  },
  {
    accessorKey: 'contactType',
    header: 'Tipo',
    cell: ({ row }) => {
        const type = row.original.contactType;
        const variant = {
            'Client': 'default',
            'Prospect': 'secondary',
            'Lead': 'outline',
            'VIP': 'destructive', // Just for color variety
            'Past Client': 'outline',
        }[type] || 'outline';
      return <Badge variant={variant as any}>{type}</Badge>;
    },
  },
  {
    accessorKey: 'categories',
    header: 'Categorias',
    cell: ({ row }) => {
      const categories = row.original.categories;
      if (!categories || categories.length === 0) return null;
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <Badge key={cat} variant="outline" className="font-normal">
              {cat}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
