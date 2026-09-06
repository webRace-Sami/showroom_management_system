import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sale = await store.getSaleById(id);
    if (!sale) {
      return NextResponse.json({ error: 'Sale record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: sale });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (body.finalPrice !== undefined) body.finalPrice = Number(body.finalPrice);
    if (body.basePrice !== undefined) body.basePrice = Number(body.basePrice);
    if (body.taxAmount !== undefined) body.taxAmount = Number(body.taxAmount);
    if (body.discountAmount !== undefined) body.discountAmount = Number(body.discountAmount);

    const updated = await store.updateSale(id, body);
    return NextResponse.json({ success: true, message: 'Sale invoice updated successfully.', data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin authority required.' }, { status: 403 });
    }

    const { id } = await params;
    await store.deleteSale(id);
    return NextResponse.json({ success: true, message: 'Sale record deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
