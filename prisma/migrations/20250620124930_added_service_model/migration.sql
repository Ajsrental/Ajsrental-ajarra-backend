/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('FixedPrice', 'PriceRange', 'StartingFrom', 'CustomQuote');

-- CreateEnum
CREATE TYPE "AvailableHours" AS ENUM ('ByAppointmentOnly', 'OpenForSelectedHours', 'AlwaysAvailable');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('BeautyAndStyling', 'DecorAndLightening', 'EntertainmentAndMedia', 'FoodAndBeverage', 'Logistics', 'PlanningAndCoordination');

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "serviceCategory" "Category" NOT NULL,
    "location" TEXT NOT NULL,
    "pricingModel" "PricingModel" NOT NULL,
    "priceMin" INTEGER,
    "priceMax" INTEGER,
    "priceFixed" INTEGER,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userId_key" ON "Vendor"("userId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
