-- CreateTable
CREATE TABLE "FlightCache" (
    "id" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "airlineName" TEXT NOT NULL,
    "airlineIata" TEXT,
    "airlineIcao" TEXT,
    "airlineLogo" TEXT,
    "originAirportCode" TEXT NOT NULL,
    "destinationAirportCode" TEXT NOT NULL,
    "originAirportName" TEXT,
    "destinationAirportName" TEXT,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "duration" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "searchParams" JSONB NOT NULL,
    "cachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlightCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightSearchCache" (
    "id" TEXT NOT NULL,
    "searchParams" JSONB NOT NULL,
    "searchHash" TEXT NOT NULL,
    "results" JSONB NOT NULL,
    "cachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlightSearchCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlightCache_originAirportCode_destinationAirportCode_depart_idx" ON "FlightCache"("originAirportCode", "destinationAirportCode", "departureTime");

-- CreateIndex
CREATE INDEX "FlightCache_cachedAt_idx" ON "FlightCache"("cachedAt");

-- CreateIndex
CREATE INDEX "FlightCache_expiresAt_idx" ON "FlightCache"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "FlightSearchCache_searchHash_key" ON "FlightSearchCache"("searchHash");

-- CreateIndex
CREATE INDEX "FlightSearchCache_searchHash_idx" ON "FlightSearchCache"("searchHash");

-- CreateIndex
CREATE INDEX "FlightSearchCache_cachedAt_idx" ON "FlightSearchCache"("cachedAt");

-- CreateIndex
CREATE INDEX "FlightSearchCache_expiresAt_idx" ON "FlightSearchCache"("expiresAt");
