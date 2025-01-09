-- CreateTable
CREATE TABLE "MinimaMeasurements" (
    "id" TEXT NOT NULL,
    "stationName" TEXT NOT NULL,
    "waterBody" TEXT NOT NULL,
    "catchmentArea" TEXT NOT NULL,
    "operatingAuthority" TEXT NOT NULL,
    "measurements" JSONB NOT NULL,

    CONSTRAINT "MinimaMeasurements_pkey" PRIMARY KEY ("id")
);
