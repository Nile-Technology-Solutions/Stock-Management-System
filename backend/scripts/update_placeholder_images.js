const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePlaceholderImages() {
  console.log('🔍 Starting placeholder image URL update...');

  try {
    // Find all photos with placeholder URLs
    const placeholderPhotos = await prisma.photo.findMany({
      where: {
        url: 'https://placehold.co/600x400/png'
      },
      include: {
        finishedProduct: {
          include: {
            category: true
          }
        },
        productionRecord: {
          include: {
            category: true
          }
        }
      }
    });

    console.log(`📊 Found ${placeholderPhotos.length} photos with placeholder URLs`);

    if (placeholderPhotos.length === 0) {
      console.log('✅ No placeholder images found. All images are already updated!');
      return;
    }

    // Update each photo based on its product category
    for (const photo of placeholderPhotos) {
      let newUrl = '';
      let categoryName = '';

      // Determine category from either finishedProduct or productionRecord
      if (photo.finishedProduct) {
        categoryName = photo.finishedProduct.category?.name || '';
      } else if (photo.productionRecord) {
        categoryName = photo.productionRecord.category?.name || '';
      }

      // Assign appropriate image URL based on category
      switch (categoryName.toLowerCase()) {
        case 'bed':
          newUrl = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop';
          break;
        case 'table':
          newUrl = 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=400&fit=crop';
          break;
        case 'cabinet':
          newUrl = 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=400&fit=crop';
          break;
        case 'door':
          newUrl = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop';
          break;
        default:
          // Generic furniture image for unknown categories
          newUrl = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop';
          break;
      }

      // Update the photo
      await prisma.photo.update({
        where: { id: photo.id },
        data: { url: newUrl }
      });

      const productName = photo.finishedProduct?.name || photo.productionRecord?.title || 'Unknown';
      console.log(`✅ Updated: ${productName} (${categoryName}) -> ${newUrl}`);
    }

    console.log('\n🎉 All placeholder images have been updated successfully!');
    console.log('🖼️  Your products should now display real furniture images.');

  } catch (error) {
    console.error('❌ Error updating placeholder images:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updatePlaceholderImages();
