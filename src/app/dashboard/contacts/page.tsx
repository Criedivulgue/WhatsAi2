import { Button } from "@/components/ui/button";
import { mockContacts } from "@/lib/data";
import { Download, PlusCircle } from "lucide-react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function ContactsPage() {
    const data = mockContacts;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Contatos</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Importar
                    </Button>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Contato
                    </Button>
                </div>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
