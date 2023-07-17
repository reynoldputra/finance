import { PrismaClient } from '../../src/generated/client'
const prisma = new PrismaClient()

async function main() {
  try {
    // testing prisma query
    // const res = await prisma.pembayaran.findMany({
    //   where: {
    //     PembayaranInvoice: {
    //       some: {
    //         invoice: {
    //           customerId: "1",
    //         },
    //       },
    //     },
    //   },
    // });
    const res = await prisma.customer.create({
      data : {
        namaCustomer : "Inu jaya"
      }
    })
    console.log(res);

    console.log(res);
  } catch (err) {
    console.log("Error : ", err);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Testing db done");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
