-- AlterTable: Make username optional and add email/phone as required fields
-- Add reset token fields for password recovery

-- Make username nullable
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL;

-- Make email required and unique
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");

-- Make phone required and unique
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL;
ALTER TABLE "User" ADD CONSTRAINT "User_phone_key" UNIQUE ("phone");

-- Add password reset fields
ALTER TABLE "User" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "User" ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
