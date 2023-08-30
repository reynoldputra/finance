/*
  Warnings:

  - A unique constraint covering the columns `[noRetur]` on the table `Retur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sisa` to the `Penagihan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Penagihan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tanggal_tagihan" DATETIME NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "kolektorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sisa" INTEGER NOT NULL,
    "keterangan" TEXT,
    "tandaTerima" BOOLEAN,
    CONSTRAINT "Penagihan_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Penagihan_kolektorId_fkey" FOREIGN KEY ("kolektorId") REFERENCES "Kolektor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Penagihan" ("id", "invoiceId", "keterangan", "kolektorId", "status", "tandaTerima", "tanggal_tagihan") SELECT "id", "invoiceId", "keterangan", "kolektorId", "status", "tandaTerima", "tanggal_tagihan" FROM "Penagihan";
DROP TABLE "Penagihan";
ALTER TABLE "new_Penagihan" RENAME TO "Penagihan";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Retur_noRetur_key" ON "Retur"("noRetur");
