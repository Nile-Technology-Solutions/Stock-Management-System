-- AlterTable: Add checkoutUrl field to Payment model for Chapa checkout URL
ALTER TABLE "Payment" ADD COLUMN "checkoutUrl" TEXT;
