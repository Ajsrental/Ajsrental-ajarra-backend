-- CreateEnum
CREATE TYPE "YearsInBusiness" AS ENUM ('LESS_THAN_1', 'TWO_TO_FIVE', 'SIX_TO_TEN', 'ELEVEN_TO_TWENTY', 'ABOVE_TWENTY');

-- CreateEnum
CREATE TYPE "BusinessCategory" AS ENUM ('DECORATOR', 'CATERER', 'PHOTOGRAPHER', 'BAKER', 'SOUND_ENGINEER', 'EVENT_PLANNER', 'DJ', 'FLORIST', 'OTHER');

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "rcNumber" TEXT NOT NULL,
    "nin" TEXT NOT NULL,
    "yearsInBusiness" "YearsInBusiness" NOT NULL,
    "businessCategory" "BusinessCategory" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);
