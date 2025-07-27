/*
  Warnings:

  - You are about to drop the column `airline` on the `FlightDetail` table. All the data in the column will be lost.
  - Added the required column `airlineId` to the `FlightDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FlightDetail" DROP COLUMN "airline",
ADD COLUMN     "airlineId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Airline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iata" TEXT,
    "icao" TEXT,
    "logo" TEXT,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlightDetail" ADD CONSTRAINT "FlightDetail_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "Airline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
