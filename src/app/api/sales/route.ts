import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const sales = await store.getSales({ search, status });
    return NextResponse.json({ success: true, count: sales.length, data: sales });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      vehicleId,
      vehicleName,
      vehicleVin,
      basePrice,
      taxAmount,
      discountAmount,
      finalPrice,
      paymentMethod,
      paymentStatus,
      deliveryStatus,
      saleDate,
      soldBy,
      notes,
    } = body;

    if (!customerName || !customerPhone || !vehicleName || !finalPrice) {
      return NextResponse.json(
        { error: 'Customer Name, Phone, Vehicle, and Final Price are required.' },
        { status: 400 }
      );
    }

    const newSale = await store.createSale({
      customerId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim() || '',
      vehicleId,
      vehicleName: vehicleName.trim(),
      vehicleVin: vehicleVin?.trim() || 'N/A',
      basePrice: Number(basePrice) || Number(finalPrice),
      taxAmount: Number(taxAmount) || 0,
      discountAmount: Number(discountAmount) || 0,
      finalPrice: Number(finalPrice),
      paymentMethod: paymentMethod || 'Bank Wire',
      paymentStatus: paymentStatus || 'PAID',
      deliveryStatus: deliveryStatus || 'DELIVERED',
      saleDate: saleDate || new Date().toISOString(),
      soldBy: soldBy?.trim() || auth.fullName || auth.username,
      notes: notes?.trim() || '',
    });

    return NextResponse.json(
      { success: true, message: 'Sales invoice created successfully and vehicle updated to SOLD.', data: newSale },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
