import { PrismaClient } from '@prisma/client';
import {
  initialCompanyInfo,
  initialUsers,
  initialVehicles,
  initialSales,
  initialCustomers,
  initialInquiries,
  initialTestDrives,
  initialSuppliers,
} from '../src/lib/initialData';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Connecting to MongoDB Atlas and Seeding Showroom Database ---');

  // 1. Seed Users
  for (const user of initialUsers) {
    const existing = await prisma.user.findUnique({ where: { username: user.username } });
    if (!existing) {
      await prisma.user.create({
        data: {
          username: user.username,
          password: user.password,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
      console.log(`Created user: ${user.username}`);
    } else {
      console.log(`User already exists: ${user.username}`);
    }
  }

  // Also create a dedicated superadmin for samiullah if desired
  const samiUser = await prisma.user.findUnique({ where: { username: 'samiullah' } });
  if (!samiUser) {
    await prisma.user.create({
      data: {
        username: 'samiullah',
        password: '$2b$10$R6ciJrh.Bo0dJoK4nOBqaeOKlz8IDtqu.geNkdaDLESQ717W71F6W', // admin123
        fullName: 'Samiullah Nawaz (Super Admin)',
        email: 'samiullah@apexluxurymotors.com',
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log('Created Super Admin user: samiullah (password: admin123)');
  }

  // 2. Seed Company Info
  const existingCompany = await prisma.companyInfo.findFirst();
  if (!existingCompany) {
    await prisma.companyInfo.create({
      data: {
        name: initialCompanyInfo.name,
        tagline: initialCompanyInfo.tagline,
        logoText: initialCompanyInfo.logoText,
        email: initialCompanyInfo.email,
        phone: initialCompanyInfo.phone,
        secondaryPhone: initialCompanyInfo.secondaryPhone,
        address: initialCompanyInfo.address,
        city: initialCompanyInfo.city,
        state: initialCompanyInfo.state,
        postalCode: initialCompanyInfo.postalCode,
        country: initialCompanyInfo.country,
        openingHours: initialCompanyInfo.openingHours,
        aboutUs: initialCompanyInfo.aboutUs,
        visionText: initialCompanyInfo.visionText,
        warrantyPolicy: initialCompanyInfo.warrantyPolicy,
        socialInstagram: initialCompanyInfo.socialInstagram,
        socialFacebook: initialCompanyInfo.socialFacebook,
        socialLinkedIn: initialCompanyInfo.socialLinkedIn,
        socialTwitter: initialCompanyInfo.socialTwitter,
        socialWhatsApp: initialCompanyInfo.socialWhatsApp,
      },
    });
    console.log('Seeded Company Info in MongoDB Atlas');
  }

  // 3. Seed Vehicles
  const vehicleCount = await prisma.vehicle.count();
  if (vehicleCount === 0) {
    for (const v of initialVehicles) {
      await prisma.vehicle.create({
        data: {
          make: v.make,
          model: v.model,
          year: v.year,
          variant: v.variant,
          vin: v.vin,
          engineNo: v.engineNo,
          bodyType: v.bodyType,
          transmission: v.transmission,
          fuelType: v.fuelType,
          exteriorColor: v.exteriorColor,
          interiorColor: v.interiorColor,
          mileage: v.mileage,
          costPrice: v.costPrice,
          sellingPrice: v.sellingPrice,
          status: v.status,
          condition: v.condition,
          features: JSON.stringify(v.features),
          description: v.description,
        },
      });
    }
    console.log(`Seeded ${initialVehicles.length} Vehicles in MongoDB Atlas`);
  }

  // 4. Seed Customers
  const customerCount = await prisma.customer.count();
  if (customerCount === 0) {
    for (const c of initialCustomers) {
      await prisma.customer.create({
        data: {
          name: c.name,
          phone: c.phone,
          email: c.email,
          nationalId: c.nationalId || null,
          address: c.address || null,
          preferredCategory: c.preferredCategory || null,
          budgetMin: c.budgetMin || null,
          budgetMax: c.budgetMax || null,
          notes: c.notes || null,
        },
      });
    }
    console.log(`Seeded ${initialCustomers.length} Customers in MongoDB Atlas`);
  }

  // 5. Seed Sales
  const salesCount = await prisma.sale.count();
  if (salesCount === 0) {
    for (const s of initialSales) {
      await prisma.sale.create({
        data: {
          invoiceNo: s.invoiceNo,
          customerName: s.customerName,
          customerPhone: s.customerPhone,
          customerEmail: s.customerEmail,
          vehicleName: s.vehicleName,
          vehicleVin: s.vehicleVin,
          basePrice: s.basePrice,
          taxAmount: s.taxAmount,
          discountAmount: s.discountAmount,
          finalPrice: s.finalPrice,
          paymentMethod: s.paymentMethod,
          paymentStatus: s.paymentStatus,
          deliveryStatus: s.deliveryStatus,
          saleDate: new Date(s.saleDate),
          soldBy: s.soldBy,
          notes: s.notes || null,
        },
      });
    }
    console.log(`Seeded ${initialSales.length} Sales & Invoices in MongoDB Atlas`);
  }

  // 6. Seed Inquiries
  const inquiryCount = await prisma.inquiry.count();
  if (inquiryCount === 0) {
    for (const inq of initialInquiries) {
      await prisma.inquiry.create({
        data: {
          customerName: inq.customerName,
          customerPhone: inq.customerPhone,
          customerEmail: inq.customerEmail,
          interestedVehicle: inq.interestedVehicle,
          budget: inq.budget || null,
          status: inq.status,
          followUpDate: inq.followUpDate ? new Date(inq.followUpDate) : null,
          notes: inq.notes || null,
        },
      });
    }
    console.log(`Seeded ${initialInquiries.length} Inquiries in MongoDB Atlas`);
  }

  // 7. Seed Test Drives
  const testDriveCount = await prisma.testDrive.count();
  if (testDriveCount === 0) {
    for (const td of initialTestDrives) {
      await prisma.testDrive.create({
        data: {
          customerName: td.customerName,
          customerPhone: td.customerPhone,
          customerEmail: td.customerEmail,
          vehicleName: td.vehicleName,
          scheduledDate: new Date(td.scheduledDate),
          licenseNumber: td.licenseNumber || 'PK-DL-99120',
          status: td.status,
          feedback: td.feedback || null,
        },
      });
    }
    console.log(`Seeded ${initialTestDrives.length} VIP Test Drives in MongoDB Atlas`);
  }

  // 8. Seed Suppliers
  const supplierCount = await prisma.supplier.count();
  if (supplierCount === 0) {
    for (const sup of initialSuppliers) {
      await prisma.supplier.create({
        data: {
          name: sup.name,
          contactPerson: sup.contactPerson,
          phone: sup.phone,
          email: sup.email,
          address: sup.address,
          totalProcured: sup.totalProcured,
          notes: sup.notes || null,
        },
      });
    }
    console.log(`Seeded ${initialSuppliers.length} Suppliers in MongoDB Atlas`);
  }

  console.log('--- MongoDB Atlas Database Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Error seeding MongoDB Atlas:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
