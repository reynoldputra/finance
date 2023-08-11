-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TandaTerimaInvoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tandaTerimaId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    CONSTRAINT "TandaTerimaInvoice_tandaTerimaId_fkey" FOREIGN KEY ("tandaTerimaId") REFERENCES "TandaTerima" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TandaTerimaInvoice_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TandaTerimaInvoice" ("id", "invoiceId", "tandaTerimaId") SELECT "id", "invoiceId", "tandaTerimaId" FROM "TandaTerimaInvoice";
DROP TABLE "TandaTerimaInvoice";
ALTER TABLE "new_TandaTerimaInvoice" RENAME TO "TandaTerimaInvoice";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
