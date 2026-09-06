import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vehicle = await store.getVehicleById(id);
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: vehicle });
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

    if (body.year) body.year = Number(body.year);
    if (body.mileage !== undefined) body.mileage = Number(body.mileage);
    if (body.costPrice !== undefined) body.costPrice = Number(body.costPrice);
    if (body.sellingPrice !== undefined) body.sellingPrice = Number(body.sellingPrice);
    if (body.vin) body.vin = body.vin.trim().toUpperCase();

    const updated = await store.updateVehicle(id, body);
    return NextResponse.json({ success: true, message: 'Vehicle updated successfully.', data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || (auth.role !== 'ADMIN' && auth.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized. Admin authority required.' }, { status: 403 });
    }

    const { id } = await params;
    await store.deleteVehicle(id);
    return NextResponse.json({ success: true, message: 'Vehicle deleted from showroom inventory.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
