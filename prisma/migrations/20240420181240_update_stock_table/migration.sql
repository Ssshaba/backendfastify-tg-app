/*
  Warnings:

  - You are about to drop the column `name` on the `Stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "name",
ADD COLUMN     "conditions" TEXT,
ADD COLUMN     "description" TEXT;
