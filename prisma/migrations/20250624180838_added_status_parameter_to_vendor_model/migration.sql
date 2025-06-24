-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "status" "VendorStatus" NOT NULL DEFAULT 'PENDING';
