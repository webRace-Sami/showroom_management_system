import { NextResponse } from 'next/server';
import store from '@/lib/store';

export async function GET() {
  try {
    const stats = await store.getDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
