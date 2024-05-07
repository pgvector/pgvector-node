-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "prisma_items" (
    "id" SERIAL NOT NULL,
    "embedding" vector(3),
    "half_embedding" halfvec(3),
    "binary_embedding" BIT(3),
    "sparse_embedding" sparsevec(3),

    CONSTRAINT "prisma_items_pkey" PRIMARY KEY ("id")
);
