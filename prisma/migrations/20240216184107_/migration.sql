/*
  Warnings:

  - You are about to drop the column `cost` on the `ProductDetail` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `ProductDetail` table. All the data in the column will be lost.
  - Added the required column `amout` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorName` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorNumber` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `glowy` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longLasting` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matte` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductDetail" DROP COLUMN "cost",
DROP COLUMN "productName",
ADD COLUMN     "amout" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "colorName" TEXT NOT NULL,
ADD COLUMN     "colorNumber" TEXT NOT NULL,
ADD COLUMN     "glowy" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "longLasting" INTEGER NOT NULL,
ADD COLUMN     "matte" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
