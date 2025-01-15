/*
  Warnings:

  - You are about to drop the `MinimaMeasurements` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('MINIMA', 'AVG', 'MAXIMA');

-- DropTable
DROP TABLE "MinimaMeasurements";

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "type" "MeasurementType" NOT NULL,
    "hzbnr" TEXT NOT NULL,
    "stationName" TEXT NOT NULL,
    "waterBody" TEXT NOT NULL,
    "catchmentArea" TEXT NOT NULL,
    "operatingAuthority" TEXT NOT NULL,
    "measurements" JSONB NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);
