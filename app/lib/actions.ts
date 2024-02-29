'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const rawFormData = {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    }
    console.log(`createInvoice server action. rawFormData: ${rawFormData}`); // logged in the server log

    const { customerId, amount, status } = CreateInvoice.parse(rawFormData);
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
        console.log('new invoice written to db');
    } catch (error) {
        throw new Error(`Create Invoice failed with error ${error}`);
    }

    revalidatePath('/dashboard/invoices'); // revalidate client cache and make a new server request
    redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(invoiceId: string, formData: FormData) {

    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });
    const amountInCents = amount * 100;
    console.log(`updateInvoice server action. invoiceId=${invoiceId}, customerId=${customerId}, amount=${amount}, status=${status}`);
    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${invoiceId}
        `;
        console.log('invoice updated in db');
    } catch (error) {
        throw Error(`Update Invoice failed with error ${error}`); // This will log the error also
    }

    revalidatePath(`/dashboard/invoices/${invoiceId}/edit`); // revalidate client cache of invoice edit page and make a new server request
    revalidatePath('/dashboard/invoices');  // revalidate client cache of invoices main page and make a new server request

    redirect('/dashboard/invoices');
}

export async function deleteInvoice(invoiceId: string) {
    console.log(`deleteInvoice server action. invoiceId=${invoiceId}`);

    try {
        await sql`DELETE FROM invoices WHERE id = ${invoiceId}`;
    } catch (error) {
        throw Error(`Delete Invoice failed with error ${error}`, { cause: error });
    }

    revalidatePath('/dashboard/invoices');  // invlidate the client cache and reload the invoice table
    // Note: This function is called from the invoices dashboard page itself, so there is no need to redirect to the page again
}