import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const customers = await store.getCustomers(search);
    return NextResponse.json({ success: true, count: customers.length, data: customers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, email, nationalId, address, preferredCategory, budgetMin, budgetMax, notes } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Customer Name and Phone number are required' }, { status: 400 });
    }

    const customer = await store.createCustomer({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      nationalId: nationalId?.trim() || '',
      address: address?.trim() || '',
      preferredCategory: preferredCategory?.trim() || '',
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      notes: notes?.trim() || '',
    });

    return NextResponse.json({ success: true, message: 'Customer added successfully.', data: customer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
