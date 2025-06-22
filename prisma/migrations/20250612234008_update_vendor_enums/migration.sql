/*
  Warnings:

  - The values [DECORATOR,SOUND_ENGINEER] on the enum `BusinessCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [LESS_THAN_1] on the enum `YearsInBusiness` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BusinessCategory_new" AS ENUM ('BAKER', 'BARTENDER', 'CATERER', 'DJ', 'ENTERTAINMENT', 'EVENT_DECORATOR', 'EVENT_PLANNER', 'FLORIST', 'HAIR_STYLIST', 'PHOTOGRAPHER', 'MAKEUP_ARTIST', 'MC_HOST', 'PHOTO_BOOTH', 'RENTALS', 'SECURITY', 'SOUND_AND_PA_SYSTEM_PROVIDER', 'SOUVENIRS', 'TRANSPORTATION_AND_LOGISTICS_SERVICE', 'USHERS', 'VIDEOGRAPHER', 'OTHER');
ALTER TABLE "Vendor" ALTER COLUMN "businessCategory" TYPE "BusinessCategory_new" USING ("businessCategory"::text::"BusinessCategory_new");
ALTER TYPE "BusinessCategory" RENAME TO "BusinessCategory_old";
ALTER TYPE "BusinessCategory_new" RENAME TO "BusinessCategory";
DROP TYPE "BusinessCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "YearsInBusiness_new" AS ENUM ('ZERO_TO_ONE', 'TWO_TO_FIVE', 'SIX_TO_TEN', 'ELEVEN_TO_TWENTY', 'ABOVE_TWENTY');
ALTER TABLE "Vendor" ALTER COLUMN "yearsInBusiness" TYPE "YearsInBusiness_new" USING ("yearsInBusiness"::text::"YearsInBusiness_new");
ALTER TYPE "YearsInBusiness" RENAME TO "YearsInBusiness_old";
ALTER TYPE "YearsInBusiness_new" RENAME TO "YearsInBusiness";
DROP TYPE "YearsInBusiness_old";
COMMIT;
