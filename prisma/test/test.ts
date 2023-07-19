import { PrismaClient } from "../../src/generated/client";
const prisma = new PrismaClient();

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
    // const res = await prisma.customer.create({
    //   data : {
    //     namaCustomer : "Inu jaya"
    //   }
    // })
    // console.log(res);

    // const res = await prisma.distribusiPembayaran.findMany({
    //   where: {
    //     invoice: {
    //       customerId: "clk7q9lc60000um34zxj6ctcr",
    //     },
    //   },
    //   include: {
    //     invoice: {
    //       include: {
    //         customer: true,
    //       },
    //     },
    //     CaraBayar: {
    //       include: {
    //         metode: true,
    //         Transfer: true,
    //         Giro: true,
    //       },
    //     },
    //   },
    //   orderBy: {
    //     tanggalTagihan: "asc",
    //   },
    // });

    // const res = await prisma.customer.findMany({
    //   where: {
    //     id: "clk7q9lc60000um34zxj6ctcr",
    //   },
    //   select: {
    //     namaCustomer: true,
    //     invoices: {
    //       select: {
    //         id: true,
    //         distribusiPembayaran: {
    //           select: {
    //             tanggalTagihan: true,
    //             CaraBayar: {
    //               select: {
    //                 metodePembayaranId: true,
    //                 Transfer: true,
    //                 Giro: true,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // const res = await prisma.distribusiPembayaran.findMany({
    //   where: {
    //     invoice: {
    //       customerId: "clk9acouv0000umqgh72pngxf",
    //     },
    //   },
    //   select: {
    //     tanggalTagihan: true,
    //     invoice: {
    //       select: {
    //         id: true,
    //         total: true,
    //         tanggalTransaksi: true,
    //         namaSales: true,
    //         distribusiPembayaran: {
    //           select: {
    //             jumlah: true,
    //             status: true,
    //             namaKolektor: true,
    //             CaraBayar: {
    //               select: {
    //                 total: true,
    //                 metode: {
    //                   select: {
    //                     jenis: true,
    //                   },
    //                 },
    //                 Giro: {
    //                   select: {
    //                     bank: true,
    //                   },
    //                 },
    //                 Transfer: {
    //                   select: {
    //                     tanggal: true,
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    const res = await prisma.distribusiPembayaran.findMany({
      where: {
        tanggalTagihan: new Date('2023-07-19T12:34:56'),
      },
      select: {
        tanggalTagihan: true,
        invoice: {
          select: {
            customer: {
              select: {
                namaCustomer: true
              }
            }
            // id: true,
            // distribusiPembayaran: {
            //   select: {
            //     tanggalTagihan: true,
            //     CaraBayar: {
            //       select: {
            //         metodePembayaranId: true,
            //         Transfer: true,
            //         Giro: true,
            //       },
            //     },
            //   },
            // },
          },
        },
        
      },
    });

    // console.log("res", res);
    console.dir(res, { depth: null });
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
