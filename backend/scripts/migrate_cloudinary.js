require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Ensure Cloudinary is configured
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function migrateImages() {
  console.log('Starting Cloudinary Image Migration...');

  // Check if credentials are set
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name_here') {
    console.error('❌ Error: Cloudinary credentials are not set in .env');
    console.error('Please update CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env');
    process.exit(1);
  }

  try {
    // 1. Fetch all photos that have local paths
    const localPhotos = await prisma.photo.findMany({
      where: {
        url: {
          startsWith: '/uploads'
        }
      }
    });

    console.log(`Found ${localPhotos.length} local images in the database to migrate.`);

    let successCount = 0;
    let failCount = 0;

    // 2. Iterate through each photo
    for (const photo of localPhotos) {
      try {
        // Construct the local file path
        // url is typically something like "/uploads/production/filename.jpg"
        // We need to map it to the actual file path "backend/uploads/production/filename.jpg"
        const relativePath = photo.url.replace(/^\/uploads/, ''); // removes /uploads
        const localFilePath = path.join(__dirname, '..', 'uploads', relativePath);

        // Check if the file exists on the local disk
        if (!fs.existsSync(localFilePath)) {
          console.warn(`⚠️ Warning: File not found on disk for Photo ID ${photo.id}: ${localFilePath}`);
          failCount++;
          continue;
        }

        console.log(`Uploading ${photo.url} to Cloudinary...`);

        // 3. Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
          folder: 'stock-management/production',
          use_filename: true,
          unique_filename: false
        });

        // 4. Update the database record with the new Cloudinary URL
        await prisma.photo.update({
          where: { id: photo.id },
          data: { url: uploadResult.secure_url }
        });

        console.log(`✅ Success: Photo ID ${photo.id} migrated -> ${uploadResult.secure_url}`);
        successCount++;
        
      } catch (err) {
        console.error(`❌ Error migrating Photo ID ${photo.id}:`, err.message);
        failCount++;
      }
    }

    console.log('\n--- Migration Complete ---');
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed/Missing: ${failCount}`);

  } catch (error) {
    console.error('Fatal Migration Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateImages();
