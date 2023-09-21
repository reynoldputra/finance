/*
  Warnings:

  - You are about to drop the column `transaksiId` on the `Retur` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Retur" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noRetur" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "tanggal_transaksi" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Retur',
    "invoiceId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Retur_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Retur" ("created_at", "id", "invoiceId", "noRetur", "tanggal_transaksi", "total", "type", "updated_at") SELECT "created_at", "id", "invoiceId", "noRetur", "tanggal_transaksi", "total", "type", "updated_at" FROM "Retur";
DROP TABLE "Retur";
ALTER TABLE "new_Retur" RENAME TO "Retur";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
