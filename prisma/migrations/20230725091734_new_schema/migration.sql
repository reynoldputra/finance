-- CreateTable
CREATE TABLE "CollectorLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama_customer" TEXT NOT NULL,
    "nama_kolektor" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CollectorLog_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
