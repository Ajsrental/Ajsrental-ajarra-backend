-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('VENDOR', 'ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "YearsInBusiness" AS ENUM ('ZERO_TO_ONE', 'TWO_TO_FIVE', 'SIX_TO_TEN', 'ELEVEN_TO_TWENTY', 'ABOVE_TWENTY');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('DECOR_AND_LIGHTING', 'ENTERTAINMENT_AND_MEDIA', 'FASHION_BEAUTY_AND_STYLING', 'FOOD_AND_BEVERAGE', 'BEAUTY_AND_STYLING', 'LOGISTICS', 'PLANNING_AND_COORDINATION');

-- CreateEnum
CREATE TYPE "ServiceName" AS ENUM ('DJ', 'ENTERTAINMENT', 'MC_HOST', 'PHOTO_BOOTH', 'PHOTOGRAPHER', 'VIDEOGRAPHER', 'ASOEBI', 'COSTUMES', 'FABRICS', 'HAIR_STYLIST', 'MAKEUP_ARTIST', 'WEDDING_DRESSES', 'EVENT_DECORATOR', 'FLORIST', 'LIGHTING', 'RENTALS', 'SOUND_AND_PA_SYSTEM_PROVIDER', 'SOUVENIRS', 'BAKER', 'BARTENDER', 'CATERER', 'LOGISTICS_SERVICE', 'TRANSPORTATION', 'EVENT_PLANNER', 'SECURITY', 'USHERS');

-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('FixedPrice', 'PriceRange', 'StartingFrom', 'CustomQuote');

-- CreateEnum
CREATE TYPE "AvailableHours" AS ENUM ('ByAppointmentOnly', 'OpenForSelectedHours', 'AlwaysAvailable');

-- CreateEnum
CREATE TYPE "RequestIDType" AS ENUM ('PHONE', 'EMAIL');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SAVINGS', 'CURRENT');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "provider" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "rcNumber" TEXT NOT NULL,
    "nin" TEXT NOT NULL,
    "yearsInBusiness" "YearsInBusiness" NOT NULL,
    "serviceCategory" "ServiceCategory" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "status" "VendorStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorService" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "name" "ServiceName" NOT NULL,

    CONSTRAINT "VendorService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pricingModel" "PricingModel" NOT NULL,
    "availableHours" "AvailableHours" NOT NULL,
    "images" TEXT[],
    "minPrice" INTEGER,
    "maxPrice" INTEGER,
    "fixedPrice" INTEGER,
    "startingPrice" INTEGER,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "idType" "RequestIDType" NOT NULL DEFAULT 'PHONE',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "pinId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorAccount" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "utilityBillUrl" TEXT,
    "validIdUrl" TEXT,
    "businessCertUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_rcNumber_key" ON "Vendor"("rcNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userId_key" ON "Vendor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorService_name_key" ON "VendorService"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_vendorId_key" ON "Service"("name", "vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_email_key" ON "VerificationRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_phone_key" ON "VerificationRequest"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "VendorAccount_vendorId_key" ON "VendorAccount"("vendorId");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorService" ADD CONSTRAINT "VendorService_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAccount" ADD CONSTRAINT "VendorAccount_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

