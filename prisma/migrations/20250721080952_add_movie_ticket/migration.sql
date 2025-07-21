-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('SEDANG_TAYANG', 'SEBENTAR_LAGI');

-- CreateTable
CREATE TABLE "MovieDetail" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "language" TEXT,
    "subtitle" TEXT,
    "posterUrl" TEXT,
    "status" "MovieStatus" NOT NULL,

    CONSTRAINT "MovieDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieDetail_productId_key" ON "MovieDetail"("productId");

-- AddForeignKey
ALTER TABLE "MovieDetail" ADD CONSTRAINT "MovieDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
