/*
  Warnings:

  - You are about to drop the `CollectorLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `kolektorId` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CollectorLog";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "kolektor_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "kolektorId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "kolektor_history_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "kolektor_history_kolektorId_fkey" FOREIGN KEY ("kolektorId") REFERENCES "Kolektor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Kolektor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama_kolektor" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama_customer" TEXT NOT NULL,
    "kolektorId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Customer_kolektorId_fkey" FOREIGN KEY ("kolektorId") REFERENCES "Kolektor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Customer" ("created_at", "id", "nama_customer", "updated_at") SELECT "created_at", "id", "nama_customer", "updated_at" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_nama_customer_key" ON "Customer"("nama_customer");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Kolektor_nama_kolektor_key" ON "Kolektor"("nama_kolektor");
