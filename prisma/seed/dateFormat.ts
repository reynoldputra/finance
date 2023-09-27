import { PrismaClient, Prisma } from "../../src/generated/client";
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Seeding data...');
        const formattedDate = (inputDate: string): string => {
          const date = new Date(inputDate);
          date.setHours(0, 0, 0, 0);
          return date.toISOString();
        };
        const invoiceUpdatePromises = await prisma.invoice.findMany();
        for (const invoice of invoiceUpdatePromises) {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: {
              tanggalTransaksi: formattedDate(invoice.tanggalTransaksi.toString()),
            },
          });
          console.log(invoice.transaksiId)
        }
        const penagihanUpdatePromises = await prisma.penagihan.findMany();
        for (const penagihan of penagihanUpdatePromises) {
          await prisma.penagihan.update({
            where: { id: penagihan.id },
            data: {
              tanggalTagihan: formattedDate(penagihan.tanggalTagihan.toString()),
            },
          });
          console.log(penagihan.id)
        }
        // Update data pada tabel Retur
        const returUpdatePromises = await prisma.retur.findMany();
        for (const retur of returUpdatePromises) {
          await prisma.retur.update({
            where: { id: retur.id },
            data: {
              tanggalTransaksi: formattedDate(retur.tanggalTransaksi.toString()),
            },
          });
          console.log(retur.noRetur)
        }
        // Update data pada tabel CaraBayar
        const caraBayarUpdatePromises = await prisma.caraBayar.findMany();
        for (const caraBayar of caraBayarUpdatePromises) {
          await prisma.caraBayar.update({
            where: { id: caraBayar.id },
            data: {
              tanggal: formattedDate(caraBayar.tanggal.toString()),
            },
          });
          console.log(caraBayar.id)
        }
        console.log('Completed.');    
    } catch (error) {
        console.log("Error : ", error);
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