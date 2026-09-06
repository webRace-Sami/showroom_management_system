import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const inquiries = await store.getInquiries(status);
    return NextResponse.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Public or Admin submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerEmail, interestedVehicle, budget, notes } = body;

    if (!customerName || !customerPhone || !interestedVehicle) {
      return NextResponse.json(
        { error: 'Customer Name, Phone, and Interested Vehicle are required.' },
        { status: 400 }
      );
    }

    const inquiry = await store.createInquiry({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim() || '',
      interestedVehicle: interestedVehicle.trim(),
      budget: budget ? Number(budget) : undefined,
      status: 'NEW',
      notes: notes?.trim() || '',
    });

    return NextResponse.json(
      { success: true, message: 'Inquiry received. Our luxury concierge will contact you shortly.', data: inquiry },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
