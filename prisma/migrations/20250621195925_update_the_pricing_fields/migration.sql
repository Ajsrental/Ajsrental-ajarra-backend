/*
  Warnings:

  - You are about to drop the column `priceFixed` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `priceMax` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `priceMin` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "priceFixed",
DROP COLUMN "priceMax",
DROP COLUMN "priceMin",
ADD COLUMN     "fixedPrice" INTEGER,
ADD COLUMN     "maxPrice" INTEGER,
ADD COLUMN     "minPrice" INTEGER,
ADD COLUMN     "startingPrice" INTEGER;
