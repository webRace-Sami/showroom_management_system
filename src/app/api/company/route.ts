import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const info = await store.getCompanyInfo();
    return NextResponse.json({ success: true, data: info });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || (auth.role !== 'ADMIN' && auth.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized. Admin authority required.' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await store.updateCompanyInfo(body);
    return NextResponse.json({ success: true, message: 'Company information updated successfully.', data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
