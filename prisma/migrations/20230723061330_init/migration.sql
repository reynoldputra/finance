-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama_customer" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "total" INTEGER NOT NULL,
    "nama_sales" TEXT NOT NULL,
    "tanggal_transaksi" DATETIME NOT NULL,
    "customerId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "distribusi_pembayaran" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jumlah" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "keterangan" TEXT,
    "tanggal_tagihan" DATETIME NOT NULL,
    "nama_kolektor" TEXT NOT NULL,
    "caraBayarId" TEXT,
    "invoiceId" TEXT NOT NULL,
    CONSTRAINT "distribusi_pembayaran_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "distribusi_pembayaran_caraBayarId_fkey" FOREIGN KEY ("caraBayarId") REFERENCES "cara_bayar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cara_bayar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "total" INTEGER NOT NULL,
    "tanda_terima" BOOLEAN NOT NULL,
    "metodePembayaranId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "cara_bayar_metodePembayaranId_fkey" FOREIGN KEY ("metodePembayaranId") REFERENCES "metode_pembayaran" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "metode_pembayaran" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jenis" TEXT NOT NULL
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
    "tanggal" DATETIME NOT NULL,
    "caraBayarId" TEXT NOT NULL,
    CONSTRAINT "Transfer_caraBayarId_fkey" FOREIGN KEY ("caraBayarId") REFERENCES "cara_bayar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_nama_customer_key" ON "Customer"("nama_customer");

-- CreateIndex
CREATE UNIQUE INDEX "metode_pembayaran_jenis_key" ON "metode_pembayaran"("jenis");

-- CreateIndex
CREATE UNIQUE INDEX "Giro_caraBayarId_key" ON "Giro"("caraBayarId");

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_caraBayarId_key" ON "Transfer"("caraBayarId");
