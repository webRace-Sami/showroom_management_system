import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin authority required.' }, { status: 403 });
    }

    const backup = await store.getFullBackupData();
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json';

    if (format === 'csv') {
      // Generate CSV for inventory & sales
      const vehicleHeaders = ['ID', 'Make', 'Model', 'Year', 'Variant', 'VIN', 'Status', 'Cost Price', 'Selling Price', 'Mileage', 'Fuel'];
      const vehicleRows = backup.vehicles.map(v => 
        [v.id, `"${v.make}"`, `"${v.model}"`, v.year, `"${v.variant}"`, `"${v.vin}"`, v.status, v.costPrice, v.sellingPrice, v.mileage, v.fuelType].join(',')
      );
      const csvContent = [vehicleHeaders.join(','), ...vehicleRows].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="showroom_inventory_archive_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, ...backup });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
