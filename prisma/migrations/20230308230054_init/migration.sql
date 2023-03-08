-- CreateTable
CREATE TABLE "Planet" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "rotation_period" TEXT NOT NULL,

    CONSTRAINT "Planet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specie" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Specie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resident" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "planetId" INTEGER NOT NULL,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeciesOnPeople" (
    "residentId" INTEGER NOT NULL,
    "specieId" INTEGER NOT NULL,

    CONSTRAINT "SpeciesOnPeople_pkey" PRIMARY KEY ("residentId","specieId")
);

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesOnPeople" ADD CONSTRAINT "SpeciesOnPeople_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesOnPeople" ADD CONSTRAINT "SpeciesOnPeople_specieId_fkey" FOREIGN KEY ("specieId") REFERENCES "Specie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
