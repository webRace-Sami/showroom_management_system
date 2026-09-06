import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin authority required.' }, { status: 403 });
    }

    const users = await store.getUsers();
    return NextResponse.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Only Admin can create staff accounts.' }, { status: 403 });
    }

    const body = await req.json();
    const { username, password, fullName, email, role, isActive } = body;

    if (!username || !password || !fullName) {
      return NextResponse.json(
        { error: 'Username, Password, and Full Name are required to create a user.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const newUser = await store.createUser({
      username,
      password,
      fullName,
      email: email || '',
      role: role || 'SALES_AGENT',
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, message: 'Staff user created successfully.', data: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
