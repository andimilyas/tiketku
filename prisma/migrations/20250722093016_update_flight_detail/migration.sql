/*
  Warnings:

  - A unique constraint covering the columns `[flightNumber]` on the table `FlightDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FlightDetail_flightNumber_key" ON "FlightDetail"("flightNumber");
