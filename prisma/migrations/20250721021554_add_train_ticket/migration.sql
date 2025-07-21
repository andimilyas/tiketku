-- CreateTable
CREATE TABLE "TrainDetail" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "trainName" TEXT NOT NULL,
    "trainNumber" TEXT NOT NULL,
    "departureStation" TEXT NOT NULL,
    "arrivalStation" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainClass" (
    "id" TEXT NOT NULL,
    "trainDetailId" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "seatCount" INTEGER NOT NULL,

    CONSTRAINT "TrainClass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainDetail_productId_key" ON "TrainDetail"("productId");

-- AddForeignKey
ALTER TABLE "TrainDetail" ADD CONSTRAINT "TrainDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainClass" ADD CONSTRAINT "TrainClass_trainDetailId_fkey" FOREIGN KEY ("trainDetailId") REFERENCES "TrainDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
