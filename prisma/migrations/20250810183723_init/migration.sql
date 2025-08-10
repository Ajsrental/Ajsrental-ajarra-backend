-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('VENDOR', 'ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "public"."VendorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."YearsInBusiness" AS ENUM ('ZERO_TO_ONE', 'TWO_TO_FIVE', 'SIX_TO_TEN', 'ELEVEN_TO_TWENTY', 'ABOVE_TWENTY');

-- CreateEnum
CREATE TYPE "public"."ServiceCategory" AS ENUM ('DECOR_AND_LIGHTING', 'ENTERTAINMENT_AND_MEDIA', 'FASHION_BEAUTY_AND_STYLING', 'FOOD_AND_BEVERAGE', 'BEAUTY_AND_STYLING', 'LOGISTICS', 'PLANNING_AND_COORDINATION');

-- CreateEnum
CREATE TYPE "public"."ServiceName" AS ENUM ('DJ', 'ENTERTAINMENT', 'MC_HOST', 'PHOTO_BOOTH', 'PHOTOGRAPHER', 'VIDEOGRAPHER', 'ASOEBI', 'COSTUMES', 'FABRICS', 'HAIR_STYLIST', 'MAKEUP_ARTIST', 'WEDDING_DRESSES', 'EVENT_DECORATOR', 'FLORIST', 'LIGHTING', 'RENTALS', 'SOUND_AND_PA_SYSTEM_PROVIDER', 'SOUVENIRS', 'BAKER', 'BARTENDER', 'CATERER', 'LOGISTICS_SERVICE', 'TRANSPORTATION', 'EVENT_PLANNER', 'SECURITY', 'USHERS');

-- CreateEnum
CREATE TYPE "public"."PricingModel" AS ENUM ('FixedPrice', 'PriceRange', 'StartingFrom', 'CustomQuote');

-- CreateEnum
CREATE TYPE "public"."AvailableHours" AS ENUM ('ByAppointmentOnly', 'OpenForSelectedHours', 'AlwaysAvailable');

-- CreateEnum
CREATE TYPE "public"."RequestIDType" AS ENUM ('PHONE', 'EMAIL');

-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('SAVINGS', 'CURRENT');

-- CreateEnum
CREATE TYPE "public"."VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'UPCOMING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('NEW_BOOKING', 'CONTRACT_PENDING', 'BOOKING_CONFIRMED', 'BOOKING_COMPLETED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'CLIENT',
    "provider" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vendor" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "rcNumber" TEXT NOT NULL,
    "nin" TEXT NOT NULL,
    "yearsInBusiness" "public"."YearsInBusiness" NOT NULL,
    "serviceCategory" "public"."ServiceCategory" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "status" "public"."VendorStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorService" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "category" "public"."ServiceCategory" NOT NULL,
    "name" "public"."ServiceName" NOT NULL,

    CONSTRAINT "VendorService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pricingModel" "public"."PricingModel" NOT NULL,
    "availableHours" "public"."AvailableHours" NOT NULL,
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
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationRequest" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "idType" "public"."RequestIDType" NOT NULL DEFAULT 'PHONE',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "pinId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorAccount" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountType" "public"."AccountType" NOT NULL,
    "utilityBillUrl" TEXT,
    "validIdUrl" TEXT,
    "businessCertUrl" TEXT,
    "verificationStatus" "public"."VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "clientName" TEXT,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT,
    "type" "public"."NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "public"."User"("providerId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_rcNumber_key" ON "public"."Vendor"("rcNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userId_key" ON "public"."Vendor"("userId");

-- CreateIndex
CREATE INDEX "Vendor_status_idx" ON "public"."Vendor"("status");

-- CreateIndex
CREATE INDEX "Vendor_serviceCategory_idx" ON "public"."Vendor"("serviceCategory");

-- CreateIndex
CREATE INDEX "Vendor_createdAt_idx" ON "public"."Vendor"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VendorService_name_key" ON "public"."VendorService"("name");

-- CreateIndex
CREATE INDEX "VendorService_vendorId_idx" ON "public"."VendorService"("vendorId");

-- CreateIndex
CREATE INDEX "VendorService_category_idx" ON "public"."VendorService"("category");

-- CreateIndex
CREATE INDEX "Service_vendorId_idx" ON "public"."Service"("vendorId");

-- CreateIndex
CREATE INDEX "Service_pricingModel_idx" ON "public"."Service"("pricingModel");

-- CreateIndex
CREATE INDEX "Service_availableHours_idx" ON "public"."Service"("availableHours");

-- CreateIndex
CREATE INDEX "Service_createdAt_idx" ON "public"."Service"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_vendorId_key" ON "public"."Service"("name", "vendorId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "public"."PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "public"."PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_email_key" ON "public"."VerificationRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_phone_key" ON "public"."VerificationRequest"("phone");

-- CreateIndex
CREATE INDEX "VerificationRequest_userId_idx" ON "public"."VerificationRequest"("userId");

-- CreateIndex
CREATE INDEX "VerificationRequest_status_idx" ON "public"."VerificationRequest"("status");

-- CreateIndex
CREATE INDEX "VerificationRequest_createdAt_idx" ON "public"."VerificationRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VendorAccount_vendorId_key" ON "public"."VendorAccount"("vendorId");

-- CreateIndex
CREATE INDEX "VendorAccount_verificationStatus_idx" ON "public"."VendorAccount"("verificationStatus");

-- CreateIndex
CREATE INDEX "VendorAccount_createdAt_idx" ON "public"."VendorAccount"("createdAt");

-- CreateIndex
CREATE INDEX "Booking_vendorId_idx" ON "public"."Booking"("vendorId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "public"."Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_bookingDate_idx" ON "public"."Booking"("bookingDate");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "public"."Booking"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorService" ADD CONSTRAINT "VendorService_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorAccount" ADD CONSTRAINT "VendorAccount_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
