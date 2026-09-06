import { NextResponse } from 'next/server';
import store from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await store.getLiveNotifications();
    return NextResponse.json({
      success: true,
      unreadCount: data.unreadCount,
      notifications: data.notifications,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
