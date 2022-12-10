/*
  Warnings:

  - Added the required column `index` to the `days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `days` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "days" ADD COLUMN     "index" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
