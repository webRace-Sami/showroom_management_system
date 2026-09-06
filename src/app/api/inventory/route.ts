import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const bodyType = searchParams.get('bodyType') || undefined;
    const fuelType = searchParams.get('fuelType') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    const vehicles = await store.getVehicles({
      search,
      status,
      bodyType,
      fuelType,
      minPrice,
      maxPrice,
    });

    return NextResponse.json({ success: true, count: vehicles.length, data: vehicles });
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
      make,
      model,
      year,
      variant,
      vin,
      engineNo,
      bodyType,
      transmission,
      fuelType,
      exteriorColor,
      interiorColor,
      mileage,
      costPrice,
      sellingPrice,
      status,
      condition,
      features,
      description,
    } = body;

    if (!make || !model || !year || !vin || !sellingPrice) {
      return NextResponse.json(
        { error: 'Make, Model, Year, VIN, and Selling Price are required.' },
        { status: 400 }
      );
    }

    const newVehicle = await store.createVehicle({
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      variant: variant?.trim() || 'Standard',
      vin: vin.trim().toUpperCase(),
      engineNo: engineNo?.trim() || 'N/A',
      bodyType: bodyType || 'Sedan',
      transmission: transmission || 'Automatic',
      fuelType: fuelType || 'Petrol',
      exteriorColor: exteriorColor?.trim() || 'Custom',
      interiorColor: interiorColor?.trim() || 'Custom',
      mileage: Number(mileage) || 0,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice),
      status: status || 'AVAILABLE',
      condition: condition || 'BRAND_NEW',
      features: features || '',
      description: description?.trim() || '',
    });

    return NextResponse.json({ success: true, message: 'Vehicle added to showroom successfully.', data: newVehicle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
