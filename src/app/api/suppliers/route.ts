import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const suppliers = await store.getSuppliers();
    return NextResponse.json({ success: true, count: suppliers.length, data: suppliers });
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
    const { name, contactPerson, phone, email, address, totalProcured, notes } = body;

    if (!name || !contactPerson || !phone) {
      return NextResponse.json(
        { error: 'Supplier Name, Contact Person, and Phone are required.' },
        { status: 400 }
      );
    }

    const supplier = await store.createSupplier({
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      address: address?.trim() || '',
      totalProcured: Number(totalProcured) || 0,
      notes: notes?.trim() || '',
    });

    return NextResponse.json({ success: true, message: 'Supplier added.', data: supplier }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
