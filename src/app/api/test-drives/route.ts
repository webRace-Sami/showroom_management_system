import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const drives = await store.getTestDrives();
    return NextResponse.json({ success: true, count: drives.length, data: drives });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Public or Admin booking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerEmail, vehicleName, scheduledDate, licenseNumber, notes } = body;

    if (!customerName || !customerPhone || !vehicleName || !scheduledDate) {
      return NextResponse.json(
        { error: 'Customer Name, Phone, Vehicle, and Scheduled Date are required.' },
        { status: 400 }
      );
    }

    const testDrive = await store.createTestDrive({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim() || '',
      vehicleName: vehicleName.trim(),
      scheduledDate,
      licenseNumber: licenseNumber?.trim() || 'VERIFY_ON_ARRIVAL',
      status: 'SCHEDULED',
      feedback: notes?.trim() || '',
    });

    return NextResponse.json(
      { success: true, message: 'Test drive scheduled successfully. An advisor will confirm your VIP slot.', data: testDrive },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
