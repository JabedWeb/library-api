/*
  Warnings:

  - The values [OVERDUE] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `images` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `BookAuthor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('BORROWED', 'RETURNED');
ALTER TABLE "public"."Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'BORROWED';
COMMIT;

-- DropForeignKey
ALTER TABLE "BookAuthor" DROP CONSTRAINT "BookAuthor_authorId_fkey";

-- DropForeignKey
ALTER TABLE "BookAuthor" DROP CONSTRAINT "BookAuthor_bookId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "images",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "imageUrl" TEXT;

-- DropTable
DROP TABLE "BookAuthor";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
