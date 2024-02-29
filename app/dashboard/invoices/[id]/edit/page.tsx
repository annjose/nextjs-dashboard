import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";
import { notFound } from "next/navigation";

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

    if(!invoice) {
        console.error(`Not found invoice with id ${invoiceId}`);
        notFound();
    }
    return (
        <EditInvoiceForm invoice={invoice} customers={customers} />
    );
}