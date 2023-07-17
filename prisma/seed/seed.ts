import { PrismaClient } from "../../src/generated/client";
import * as csv from "csv-parser";
import * as fs from "fs";
import * as path from "path";
const prisma = new PrismaClient();

async function main() {
  const results : unknown[] = [];
  console.log("path :", path.resolve(__dirname, "./data/tagihan.csv"))
  try {
    fs.createReadStream(path.resolve(__dirname, "./data/tagihan.csv"))
      .pipe(csv())
      .on("data", (data : any) => {
        console.log(data)
      })
      .on("end", () => {
        console.log(results);
      });

  } catch (err) {
    console.log("Error : ", err);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding db done.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
