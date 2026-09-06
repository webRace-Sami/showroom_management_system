import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (body.totalProcured !== undefined) body.totalProcured = Number(body.totalProcured);

    const updated = await store.updateSupplier(id, body);
    return NextResponse.json({ success: true, message: 'Supplier updated.', data: updated });
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
    await store.deleteSupplier(id);
    return NextResponse.json({ success: true, message: 'Supplier deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
