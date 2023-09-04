/*
  Warnings:

  - You are about to alter the column `total` on the `Retur` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Float`.
  - You are about to alter the column `sisa` on the `Penagihan` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Float`.
  - You are about to alter the column `total` on the `cara_bayar` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Float`.
  - You are about to alter the column `total` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Float`.
  - You are about to alter the column `jumlah` on the `distribusi_pembayaran` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Retur" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noRetur" TEXT NOT NULL,
    "transaksiId" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "tanggal_transaksi" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Retur',
    "invoiceId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Retur_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Retur" ("created_at", "id", "invoiceId", "noRetur", "tanggal_transaksi", "total", "transaksiId", "type", "updated_at") SELECT "created_at", "id", "invoiceId", "noRetur", "tanggal_transaksi", "total", "transaksiId", "type", "updated_at" FROM "Retur";
DROP TABLE "Retur";
ALTER TABLE "new_Retur" RENAME TO "Retur";
CREATE UNIQUE INDEX "Retur_noRetur_key" ON "Retur"("noRetur");
CREATE TABLE "new_Penagihan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tanggal_tagihan" DATETIME NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "kolektorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sisa" REAL NOT NULL,
    "keterangan" TEXT,
    "tandaTerima" BOOLEAN,
    CONSTRAINT "Penagihan_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Penagihan_kolektorId_fkey" FOREIGN KEY ("kolektorId") REFERENCES "Kolektor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Penagihan" ("id", "invoiceId", "keterangan", "kolektorId", "sisa", "status", "tandaTerima", "tanggal_tagihan") SELECT "id", "invoiceId", "keterangan", "kolektorId", "sisa", "status", "tandaTerima", "tanggal_tagihan" FROM "Penagihan";
DROP TABLE "Penagihan";
ALTER TABLE "new_Penagihan" RENAME TO "Penagihan";
CREATE TABLE "new_cara_bayar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "total" REAL NOT NULL,
    "tanda_terima" BOOLEAN NOT NULL,
    "metodePembayaranId" INTEGER NOT NULL,
    "tanggal" DATETIME NOT NULL,
    "keterangan" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "cara_bayar_metodePembayaranId_fkey" FOREIGN KEY ("metodePembayaranId") REFERENCES "metode_pembayaran" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cara_bayar" ("created_at", "id", "keterangan", "metodePembayaranId", "tanda_terima", "tanggal", "total", "updated_at") SELECT "created_at", "id", "keterangan", "metodePembayaranId", "tanda_terima", "tanggal", "total", "updated_at" FROM "cara_bayar";
DROP TABLE "cara_bayar";
ALTER TABLE "new_cara_bayar" RENAME TO "cara_bayar";
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transaksiId" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "tanggal_transaksi" DATETIME NOT NULL,
    "nama_sales" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Cash',
    "customerId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("created_at", "customerId", "id", "nama_sales", "tanggal_transaksi", "total", "transaksiId", "type", "updated_at") SELECT "created_at", "customerId", "id", "nama_sales", "tanggal_transaksi", "total", "transaksiId", "type", "updated_at" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_transaksiId_key" ON "Invoice"("transaksiId");
CREATE TABLE "new_distribusi_pembayaran" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jumlah" REAL NOT NULL,
    "caraBayarId" TEXT NOT NULL,
    "penagihanId" TEXT NOT NULL,
    CONSTRAINT "distribusi_pembayaran_penagihanId_fkey" FOREIGN KEY ("penagihanId") REFERENCES "Penagihan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "distribusi_pembayaran_caraBayarId_fkey" FOREIGN KEY ("caraBayarId") REFERENCES "cara_bayar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_distribusi_pembayaran" ("caraBayarId", "id", "jumlah", "penagihanId") SELECT "caraBayarId", "id", "jumlah", "penagihanId" FROM "distribusi_pembayaran";
DROP TABLE "distribusi_pembayaran";
ALTER TABLE "new_distribusi_pembayaran" RENAME TO "distribusi_pembayaran";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
