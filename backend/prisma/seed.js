const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {
      fullName: 'Super Admin User',
      username: 'superadmin',
      password: hashedPassword,
      role: 'SuperAdmin',
      phone: '0911000001',
    },
    create: {
      fullName: 'Super Admin User',
      email: 'superadmin@example.com',
      username: 'superadmin',
      password: hashedPassword,
      role: 'SuperAdmin',
      phone: '0911000001',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      fullName: 'Admin User',
      username: 'admin',
      password: hashedPassword,
      role: 'Admin',
      phone: '0911000002',
    },
    create: {
      fullName: 'Admin User',
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      role: 'Admin',
      phone: '0911000002',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {
      fullName: 'John Doe',
      username: 'customer',
      password: hashedPassword,
      role: 'Customer',
      phone: '0911000003',
      // do not recreate address on update, assume existing
    },
    create: {
      fullName: 'John Doe',
      email: 'customer@example.com',
      username: 'customer',
      password: hashedPassword,
      role: 'Customer',
      phone: '0911000003',
      addresses: {
        create: {
          street: 'Bole Road',
          city: 'Addis Ababa',
          isDefault: true,
        },
      },
    },
  });

  console.log('✅ Users seeded');

  // 2. Seed Categories
  // use upsert or createMany with skipDuplicates to avoid conflicts
  const bedCategory = await prisma.category.upsert({
    where: { name: 'Bed' },
    update: { description: 'Bedroom furniture' },
    create: { name: 'Bed', description: 'Bedroom furniture' },
  });
  const doorCategory = await prisma.category.upsert({
    where: { name: 'Door' },
    update: { description: 'Interior and exterior doors' },
    create: { name: 'Door', description: 'Interior and exterior doors' },
  });
  const tableCategory = await prisma.category.upsert({
    where: { name: 'Table' },
    update: { description: 'Tables and desks' },
    create: { name: 'Table', description: 'Tables and desks' },
  });
  const cabinetCategory = await prisma.category.upsert({
    where: { name: 'Cabinet' },
    update: { description: 'Cabinets and storage' },
    create: { name: 'Cabinet', description: 'Cabinets and storage' },
  });
  const otherCategory = await prisma.category.upsert({
    where: { name: 'Other' },
    update: { description: 'Miscellaneous items' },
    create: { name: 'Other', description: 'Miscellaneous items' },
  });
  // Sub-category example
  const woodCategory = await prisma.category.upsert({
    where: { name: 'Wood' },
    update: { description: 'Wood materials', parentId: otherCategory.id },
    create: { name: 'Wood', description: 'Wood materials', parentId: otherCategory.id },
  });

  console.log('✅ Categories seeded');

  // 3. Seed Stock Materials
  await prisma.stockMaterial.createMany({
    data: [
      {
        name: 'Oak Wood Plank',
        quantity: 100,
        color: 'Brown',
        size: '2x4x8',
        thickness: '2 inch',
        laminated: false,
        origin: 'Local',
        typeNote: 'Premium quality',
        categoryId: woodCategory.id,
      },
      {
        name: 'MDF Board',
        quantity: 50,
        color: 'White',
        size: '4x8',
        thickness: '18mm',
        laminated: true,
        origin: 'Imported',
        categoryId: woodCategory.id,
      },
    ],
  });
  console.log('✅ Stock Materials seeded');

  // 4. Seed Finished Products (with photos via nested create)
  const bedProduct = await prisma.finishedProduct.create({
    data: {
      name: 'Queen Wooden Bed',
      categoryId: bedCategory.id,
      color: 'Mahogany',
      stockQuantity: 5,
      price: 15000.0,
      description: 'Queen size wooden bed',
      photos: {
        create: [{ url: 'https://placehold.co/600x400/png', description: 'Front view' }],
      },
    },
  });

  const tableProduct = await prisma.finishedProduct.create({
    data: {
      name: 'Office Desk',
      categoryId: tableCategory.id,
      color: 'Black',
      stockQuantity: 10,
      price: 5000.0,
      description: 'Office desk',
      photos: {
        create: [{ url: 'https://placehold.co/600x400/png', description: 'Top view' }],
      },
    },
  });
  console.log('✅ Finished Products seeded');

  // 5. Seed Production Records (with photos via nested create)
  await prisma.productionRecord.create({
    data: {
      title: 'Custom Kitchen Cabinet',
      categoryId: cabinetCategory.id,
      status: 'UnderProcess',
      progressPercentage: 45,
      startedDate: new Date(),
      submittingDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      workInstructions: 'Ensure smooth finish on edges.',
      photos: {
        create: [{ url: 'https://placehold.co/600x400/png', description: 'Progress shot' }],
      },
    },
  });
  console.log('✅ Production Records seeded');

  // 6. Seed Orders and Payments
  const custWithAddress = await prisma.user.findUnique({
    where: { username: 'customer' },
    include: { addresses: true },
  });

  const order = await prisma.order.create({
    data: {
      productName: 'Custom Door',
      quantity: 2,
      userId: custWithAddress.id,
      deliveryAddressId: custWithAddress.addresses[0].id,
      status: 'OrderSubmitted',
      totalPrice: 2500.0,
      payments: {
        create: {
          amount: 2500.0,
          method: 'Telebirr',
          status: 'Pending',
          transactionRef: 'TXN123456789',
        },
      },
    },
  });
  console.log(`✅ Order created with ID: ${order.id}`);

  // 7. Seed Todo Items
  await prisma.todoItem.createMany({
    data: [
      { day: 'Monday', task: 'Check inventory levels', isCompleted: false },
      { day: 'Friday', task: 'Weekly team meeting', isCompleted: true },
    ],
  });
  console.log('✅ Todo Items seeded');

  // 8. Seed News Posts
  await prisma.newsPost.create({
    data: {
      title: 'Holiday Schedule',
      content: 'The workshop will be closed for the upcoming holidays.',
      status: 'Published',
    },
  });
  console.log('✅ News Posts seeded');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
