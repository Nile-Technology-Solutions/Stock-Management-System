# Bugfix Requirements Document

## Introduction

The Stock Management System displays placeholder images (600×400 gray boxes with text) instead of actual product images on both the public product listing page and admin showcase management page. This occurs because the database seed script populates the `FinishedProduct` table with placeholder URLs (`https://placehold.co/600x400/png`) rather than real Cloudinary image URLs. While the Cloudinary integration is functional and new uploads work correctly, existing seeded products show placeholders, creating an unprofessional appearance on the deployed frontend (Vercel).

This bug affects the visual presentation of the product catalog and undermines user trust in the e-commerce platform. The fix must update the seed data to use real product images while ensuring the existing image upload and rendering functionality remains intact.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the database is seeded using `backend/prisma/seed.js` THEN the system creates `FinishedProduct` records with `photos.url` set to `'https://placehold.co/600x400/png'`

1.2 WHEN the public product listing page (`/products`) loads THEN the system displays 600×400 gray placeholder boxes instead of actual product images for seeded products

1.3 WHEN the admin showcase management page loads THEN the system displays 600×400 gray placeholder boxes instead of actual product images for seeded products

1.4 WHEN a user views a product card THEN the system renders an `<img>` tag with `src="https://placehold.co/600x400/png"` resulting in a generic gray box with dimensions text

### Expected Behavior (Correct)

2.1 WHEN the database is seeded using `backend/prisma/seed.js` THEN the system SHALL create `FinishedProduct` records with `photos.url` set to valid Cloudinary image URLs or representative product image URLs

2.2 WHEN the public product listing page (`/products`) loads THEN the system SHALL display actual product images from Cloudinary or fallback to a proper default image for seeded products

2.3 WHEN the admin showcase management page loads THEN the system SHALL display actual product images from Cloudinary or fallback to a proper default image for seeded products

2.4 WHEN a user views a product card THEN the system SHALL render an `<img>` tag with `src` pointing to a valid product image URL that displays a meaningful visual representation of the product

2.5 WHEN the seed script runs THEN the system SHALL use sample Cloudinary URLs or publicly accessible furniture/product images that represent the product categories (Bed, Table, Door, Cabinet)

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a new product is uploaded via the admin panel with an image THEN the system SHALL CONTINUE TO store the Cloudinary URL correctly and display the uploaded image

3.2 WHEN the `getImageUrl()` helper function processes an absolute URL (http://, https://, data:, blob:) THEN the system SHALL CONTINUE TO return the URL unchanged

3.3 WHEN the `getImageUrl()` helper function processes a relative URL THEN the system SHALL CONTINUE TO prepend the API_BASE_URL to create an absolute URL

3.4 WHEN the `normalizeProductForPublic()` function processes a product THEN the system SHALL CONTINUE TO resolve relative URLs to full backend URLs

3.5 WHEN a product has no image or a null/empty image URL THEN the system SHALL CONTINUE TO fall back to the placeholder image `'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image'` as defined in `ProductCard.jsx`

3.6 WHEN the Cloudinary integration uploads an image via `multer.js` THEN the system SHALL CONTINUE TO store images in the `stock-management/production` folder with unique filenames

3.7 WHEN a user fetches products via `/api/products` endpoint THEN the system SHALL CONTINUE TO return products with properly normalized image URLs

3.8 WHEN a product has multiple photos THEN the system SHALL CONTINUE TO use the first photo as the primary image in the product card listing
