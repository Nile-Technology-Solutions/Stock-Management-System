const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImages() {
  console.log('🔍 Checking all product images in database...\n');

  try {
    // Get all finished products with their photos
    const products = await prisma.finishedProduct.findMany({
      include: {
        photos: true,
        category: true
      }
    });

    console.log(`📦 Total Finished Products: ${products.length}\n`);

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category?.name || 'No category'})`);
      if (product.photos && product.photos.length > 0) {
        product.photos.forEach((photo, photoIndex) => {
          const isPlaceholder = photo.url.includes('placehold.co');
          const icon = isPlaceholder ? '❌' : '✅';
          console.log(`   ${icon} Photo ${photoIndex + 1}: ${photo.url}`);
        });
      } else {
        console.log('   ⚠️  No photos');
      }
      console.log('');
    });

    // Get all production records with photos
    const productions = await prisma.productionRecord.findMany({
      include: {
        photos: true,
        category: true
      }
    });

    console.log(`\n🏭 Total Production Records: ${productions.length}\n`);

    productions.forEach((production, index) => {
      console.log(`${index + 1}. ${production.title} (${production.category?.name || 'No category'})`);
      if (production.photos && production.photos.length > 0) {
        production.photos.forEach((photo, photoIndex) => {
          const isPlaceholder = photo.url.includes('placehold.co');
          const icon = isPlaceholder ? '❌' : '✅';
          console.log(`   ${icon} Photo ${photoIndex + 1}: ${photo.url}`);
        });
      } else {
        console.log('   ⚠️  No photos');
      }
      console.log('');
    });

    // Summary
    const allPhotos = await prisma.photo.findMany();
    const placeholderCount = allPhotos.filter(p => p.url.includes('placehold.co')).length;
    const realImageCount = allPhotos.filter(p => !p.url.includes('placehold.co')).length;

    console.log('\n📊 Summary:');
    console.log(`   Total Photos: ${allPhotos.length}`);
    console.log(`   ✅ Real Images: ${realImageCount}`);
    console.log(`   ❌ Placeholders: ${placeholderCount}`);

  } catch (error) {
    console.error('❌ Error checking images:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkImages();
