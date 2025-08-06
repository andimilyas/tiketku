/*
  Warnings:

  - You are about to drop the column `document` on the `Passenger` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Passenger` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `Passenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentNumber` to the `Passenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentType` to the `Passenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Passenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Passenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `Passenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Passenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Passenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Passenger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Passenger" DROP COLUMN "document",
DROP COLUMN "fullName",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "documentExpiry" TIMESTAMP(3),
ADD COLUMN     "documentNumber" TEXT NOT NULL,
ADD COLUMN     "documentType" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "mealPreference" TEXT,
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
