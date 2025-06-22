/*
  Warnings:

  - A unique constraint covering the columns `[name,vendorId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Service_name_vendorId_key" ON "Service"("name", "vendorId");
