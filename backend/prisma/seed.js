const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Clean existing data (optional, be careful in production)
  // await prisma.payment.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.productionRecord.deleteMany();
  // await prisma.finishedProduct.deleteMany();
  // await prisma.stockMaterial.deleteMany();
  // await prisma.todoItem.deleteMany();
  // await prisma.newsPost.deleteMany();
  // await prisma.user.deleteMany();

  // 2. Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      fullName: 'Super Admin User',
      username: 'superadmin',
      password: hashedPassword,
      role: 'SuperAdmin',
    },
  });

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      fullName: 'Admin User',
      username: 'admin',
      password: hashedPassword,
      role: 'Admin',
    },
  });

  const customer = await prisma.user.upsert({
    where: { username: 'customer' },
    update: {},
    create: {
      fullName: 'John Doe',
      username: 'customer',
      password: hashedPassword,
      role: 'Customer',
    },
  });

  console.log('✅ Users seeded');

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
      },
      {
        name: 'MDF Board',
        quantity: 50,
        color: 'White',
        size: '4x8',
        thickness: '18mm',
        laminated: true,
        origin: 'Imported',
      },
    ],
  });
  console.log('✅ Stock Materials seeded');

  // 4. Seed Finished Products
  await prisma.finishedProduct.createMany({
    data: [
      {
        category: 'Bed',
        photos: ['https://placehold.co/600x400/png'],
        color: 'Mahogany',
        amount: 5,
        price: 15000.00,
        description: 'Queen size wooden bed',
      },
      {
        category: 'Table',
        photos: ['https://placehold.co/600x400/png'],
        color: 'Black',
        amount: 10,
        price: 5000.00,
        description: 'Office desk',
      },
    ],
  });
  console.log('✅ Finished Products seeded');

  // 5. Seed Production Records
  await prisma.productionRecord.create({
    data: {
      category: 'Cabinet',
      status: 'UnderProcess',
      progressPercentage: 45,
      startedDate: new Date(),
      submittingDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
      workInstructions: 'Ensure smooth finish on edges.',
      photos: ['https://placehold.co/600x400/png'],
    },
  });
  console.log('✅ Production Records seeded');

  // 6. Seed Orders and Payments
  const order = await prisma.order.create({
    data: {
      productName: 'Custom Door',
      quantity: 2,
      clientName: 'Alice Smith',
      phone: '0911223344',
      address: 'Addis Ababa, Bole',
      status: 'OrderSubmitted',
      Payment: {
        create: {
          amount: 2500.00,
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