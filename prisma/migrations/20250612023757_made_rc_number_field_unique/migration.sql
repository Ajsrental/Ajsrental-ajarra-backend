/*
  Warnings:

  - A unique constraint covering the columns `[rcNumber]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vendor_rcNumber_key" ON "Vendor"("rcNumber");
