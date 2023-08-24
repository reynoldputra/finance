-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama_customer" TEXT NOT NULL,
    "alamat" TEXT,
    "kolektorId" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Customer_kolektorId_fkey" FOREIGN KEY ("kolektorId") REFERENCES "Kolektor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Penagihan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tanggal_tagihan" DATETIME NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "kolektorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "keterangan" TEXT,
    "tandaTerima" BOOLEAN,
    CONSTRAINT "Penagihan_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Penagihan_kolektorId_fkey" FOREIGN KEY ("kolektorId") REFERENCES "Kolektor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TandaTerima" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tanggalTT" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TandaTerimaInvoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tandaTerimaId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    CONSTRAINT "TandaTerimaInvoice_tandaTerimaId_fkey" FOREIGN KEY ("tandaTerimaId") REFERENCES "TandaTerima" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TandaTerimaInvoice_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Retur" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noRetur" TEXT NOT NULL,
    "transaksiId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "tanggal_transaksi" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Retur',
    "invoiceId" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Retur_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transaksiId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "tanggal_transaksi" DATETIME NOT NULL,
    "nama_sales" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CASH',
    "customerId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "distribusi_pembayaran" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jumlah" INTEGER NOT NULL,
    "caraBayarId" TEXT NOT NULL,
    "penagihanId" TEXT NOT NULL,
    CONSTRAINT "distribusi_pembayaran_penagihanId_fkey" FOREIGN KEY ("penagihanId") REFERENCES "Penagihan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "distribusi_pembayaran_caraBayarId_fkey" FOREIGN KEY ("caraBayarId") REFERENCES "cara_bayar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cara_bayar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "total" INTEGER NOT NULL,
    "tanda_terima" BOOLEAN NOT NULL,
    "metodePembayaranId" INTEGER NOT NULL,
    "tanggal" DATETIME NOT NULL,
    "keterangan" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "cara_bayar_metodePembayaranId_fkey" FOREIGN KEY ("metodePembayaranId") REFERENCES "metode_pembayaran" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "metode_pembayaran" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jenis" TEXT NOT NULL,
    "batas_atas" INTEGER NOT NULL,
    "bayasBawah" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Giro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bank" TEXT NOT NULL,
    "nomor" TEXT NOT NULL,
    "jatuh_tempo" DATETIME NOT NULL,
    "caraBayarId" TEXT NOT NULL,
    CONSTRAINT "Giro_caraBayarId_fkey" FOREIGN KEY ("caraBayarId") REFERENCES "cara_bayar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bank" TEXT NOT NULL,
    "caraBayarId" TEXT NOT NULL,
    CONSTRAINT "Transfer_caraBayarId_fkey" FOREIGN KEY ("caraBayarId") REFERENCES "cara_bayar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_nama_customer_key" ON "Customer"("nama_customer");

-- CreateIndex
CREATE UNIQUE INDEX "Kolektor_nama_kolektor_key" ON "Kolektor"("nama_kolektor");

-- CreateIndex
CREATE UNIQUE INDEX "Retur_transaksiId_key" ON "Retur"("transaksiId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_transaksiId_key" ON "Invoice"("transaksiId");

-- CreateIndex
CREATE UNIQUE INDEX "metode_pembayaran_jenis_key" ON "metode_pembayaran"("jenis");

-- CreateIndex
CREATE UNIQUE INDEX "Giro_caraBayarId_key" ON "Giro"("caraBayarId");

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_caraBayarId_key" ON "Transfer"("caraBayarId");
