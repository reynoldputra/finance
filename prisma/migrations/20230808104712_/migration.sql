-- CreateTable
CREATE TABLE "TandaTerima" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "TandaTerimaInvoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tandaTerimaId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    CONSTRAINT "TandaTerimaInvoice_tandaTerimaId_fkey" FOREIGN KEY ("tandaTerimaId") REFERENCES "TandaTerima" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TandaTerimaInvoice_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
