/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `VerificationRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "VerificationRequest" ADD COLUMN     "phone" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_phone_key" ON "VerificationRequest"("phone");
