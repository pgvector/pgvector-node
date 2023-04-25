-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "prisma_items" (
    "id" SERIAL NOT NULL,
    "embedding" vector(3),

    CONSTRAINT "prisma_items_pkey" PRIMARY KEY ("id")
);

