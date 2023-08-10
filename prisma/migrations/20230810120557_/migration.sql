-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TandaTerima" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tanggalTT" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_TandaTerima" ("created_at", "id", "tanggalTT", "updated_at") SELECT "created_at", "id", "tanggalTT", "updated_at" FROM "TandaTerima";
DROP TABLE "TandaTerima";
ALTER TABLE "new_TandaTerima" RENAME TO "TandaTerima";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
