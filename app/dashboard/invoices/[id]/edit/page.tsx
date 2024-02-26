import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";

export default async function Page({
    params
}: {
    params: {
        'id': string
    }
}) {
    console.log(`page params: ${JSON.stringify(params)}`)
    const invoiceId = params.id;

    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(invoiceId),
        fetchCustomers()
    ])

    return (
        <EditInvoiceForm invoice={invoice} customers={customers} />
    );
}