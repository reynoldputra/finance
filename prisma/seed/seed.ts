import { PrismaClient, Prisma, Invoice, Penagihan } from "../../src/generated/client";
// import * as csvParser from "csv-parser";
const csvParser = require("csv-parser")
// const csv = require("csv-parser")
import { parse } from "csv-parse";
import * as fs from "fs";
import * as path from "path";
const prisma = new PrismaClient();

async function main() {
  const metodePembayaran: Prisma.MetodePembayaranUncheckedCreateInput[] = [
    { id: 1, jenis: "CASH" },
    { id: 2, jenis: "GIRO" },
    { id: 3, jenis: "TRANSFER" },
  ];

  await prisma.$queryRawUnsafe(`DELETE FROM kolektor_history`);
  await prisma.$queryRawUnsafe(`DELETE FROM giro;`);
  await prisma.$queryRawUnsafe(`DELETE FROM transfer;`);
  await prisma.$queryRawUnsafe(`DELETE FROM cara_bayar;`);
  await prisma.$queryRawUnsafe(`DELETE FROM distribusi_pembayaran;`);
  await prisma.$queryRawUnsafe(`DELETE FROM invoice`);
  await prisma.$queryRawUnsafe(`DELETE FROM penagihan`);

  for (let idx in metodePembayaran) {
    const m = metodePembayaran[idx];
    console.log(m);
    await prisma.metodePembayaran.upsert({
      where: { id: m.id },
      create: m,
      update: m,
    });
  }

  let currentCustName: string = "";
  let salesName: string = "";
  let colectorName: string = "";
  const allData: any[] = [];

  try {
    fs.createReadStream(path.resolve(__dirname, "./data/tagihan.csv"))
      .pipe(csvParser())
      .on("data", (data: any) => {
        allData.push(data);
      })
      .on("end", async () => {
        console.log("Read csv is done.");
        for (let idx in allData) {
          console.log(idx);
          const data = allData[idx];

          if (data.nama_customer) currentCustName = data.nama_customer;
          if (data.nama_sales) salesName = data.nama_sales;
          if (data.nama_kolektor) colectorName = data.nama_kolektor;
          let totalPembayaran = 0
          let invoiceId = ""
          let penagihanId = ""

          await prisma.$transaction(async (ctx) => {
            const newKolektor : Prisma.KolektorCreateInput = {
              nama : colectorName
            }

            const kolektor = await ctx.kolektor.upsert({
              where : {nama : colectorName},
              create : newKolektor,
              update : newKolektor
            })

            // creating customer
            const newCust: Prisma.CustomerCreateWithoutInvoicesInput = {
              nama: data.nama_customer ? data.nama_customer : (currentCustName as string),
              currentKolektor : {
                connect : {
                  id : kolektor.id
                }
              }
            };

            const customer = await ctx.customer.upsert({
              where: {
                nama: currentCustName,
              },
              update: newCust,
              create: newCust,
            });

            const daftarCollector = await ctx.kolektorHistory.findMany({
              where: {
                customerId: customer.id,
              },
              include : {
                kolektor : true
              },
              orderBy: {
                createdAt: "desc",
              },
            });

            if (daftarCollector.length) {
              if (colectorName != daftarCollector[0].kolektor.nama) {
                await ctx.kolektorHistory.create({
                  data: {
                    kolektorId : kolektor.id,
                    customerId : customer.id
                  },
                });
                await ctx.customer.update({
                  where : {id : customer.id},
                  data : {
                    kolektorId : kolektor.id
                  }
                })
              }
            } else {
              await ctx.kolektorHistory.create({
                data: {
                  kolektorId : kolektor.id,
                  customerId : customer.id
                },
              });
            }

            // creating invoice
            let tanggalTransaksi = data.tanggal_transaksi + "/2023";
            const [day, month, year] = tanggalTransaksi.split("/");
            const tanggal_transaksi = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            const newInvoice: Prisma.InvoiceCreateInput = {
              id: data.transaksi_id,
              tanggalTransaksi: tanggal_transaksi,
              total: parseInt(data.total_tagihan) as number,
              namaSales: salesName,
              customer: {
                connect: {
                  id: customer.id,
                },
              },
            };

            const invoice = await ctx.invoice.upsert({
              where: { id: data.transaksi_id },
              create: newInvoice,
              update: newInvoice,
            });
            invoiceId = invoice.id

            const jatuhTempo = data.jatuh_tempo + "/2023";
            const [dayJt, monthJt, yearJt] = jatuhTempo.split("/");
            const jatuhTempoDate = new Date(
              parseInt(yearJt),
              parseInt(monthJt) - 1,
              parseInt(dayJt)
            );


            let tanggal_tagihan = data.tanggal_tagihan;
            const [d, m, y] = tanggal_tagihan.split("/");
            const tanggalTagihanDate = new Date(
              parseInt(d),
              parseInt(m) - 1,
              parseInt(y)
            );

            const penagihan = await ctx.penagihan.create({
              data : {
                tanggalTagihan : tanggalTagihanDate,
                invoiceId : invoice.id,
                kolektorId : kolektor.id,
                status : 'WAITING'
              }
            })

            penagihanId = penagihan.id

            console.log(penagihan)


            if (data.giro_id) {
              let newGiro: Prisma.GiroCreateWithoutCaraBayarInput | Prisma.GiroCreateInput = {
                id: data.giro_id,
                bank: data.giro_bank as string,
                nomor: data.no_giro,
                jatuhTempo: jatuhTempoDate,
              };

              const findGiro = await prisma.giro.findFirst({
                where: { id: newGiro.id },
              });
              if (findGiro) {
                newGiro = {
                  ...newGiro,
                  caraBayar: {
                    connect: {
                      id: findGiro.caraBayarId,
                    },
                  },
                };
              } else {
                newGiro = {
                  ...newGiro,
                  caraBayar: {
                    create: {
                      total: parseInt(data.giro_amount),
                      tandaTerima: data.tanda_terima == "TRUE",
                      metodePembayaranId: 2,
                    },
                  },
                };
              }

              const giro = await ctx.giro.upsert({
                where: { id: data.giro_id },
                create: newGiro,
                update: newGiro,
                include: {
                  caraBayar: true,
                },
              });

              const findInvoice = await ctx.invoice.findFirst({
                where: { id: invoice.id },
                include: {
                  penagihan : {
                    include : {
                      distribusiPembayaran : true
                    }
                  }
                },
              });

              let sisaTagihan = 0;

              if (findInvoice) {
                const telahDibayar = findInvoice.penagihan.reduce((tot, cur) => {
                  const pem = cur.distribusiPembayaran.reduce((tot, cur) => {
                    return tot += cur.jumlah
                  }, 0)

                  return tot += pem
                }, 0)
                sisaTagihan = invoice.total - telahDibayar;
              }

              let tanggal_tagihan = data.tanggal_tagihan;
              const [day, month, year] = tanggal_tagihan.split("/");
              const tanggalTagihanDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              );

              const distribusiPembayaran = await ctx.distribusiPembayaran.create({
                data: {
                  penagihanId: penagihan.id,
                  caraBayarId: giro.caraBayarId,
                  jumlah: giro.caraBayar.total > sisaTagihan ? sisaTagihan : giro.caraBayar.total,
                },
                include: {
                  caraBayar: {
                    include: {
                      giro: true,
                    },
                  },
                },
              });

              totalPembayaran += giro.caraBayar.total
            }

            if (data.transfer_id) {
              const [d, m] = data.tanggal_transfer.split("/");
              let newTransfer:
                | Prisma.TransferCreateInput
                | Prisma.TransferCreateWithoutCaraBayarInput = {
                id: data.transfer_id,
                tanggal: new Date(2023, parseInt(m) - 1, parseInt(d)),
              };

              const findTransfer = await prisma.transfer.findFirst({
                where: {
                  id: newTransfer.id,
                },
              });

              if (findTransfer) {
                newTransfer = {
                  ...newTransfer,
                  caraBayar: {
                    connect: {
                      id: findTransfer.caraBayarId,
                    },
                  },
                };
              } else {
                newTransfer = {
                  ...newTransfer,
                  caraBayar: {
                    create: {
                      total: parseInt(data.transfer_amount),
                      tandaTerima: data.tanda_terima == "TRUE",
                      metodePembayaranId: 3,
                    },
                  },
                };
              }

              const transfer = await ctx.transfer.upsert({
                where: { id: data.transfer_id },
                create: newTransfer,
                update: newTransfer,
                include: {
                  caraBayar: true,
                },
              });

              const findInvoice = await ctx.invoice.findFirst({
                where: { id: invoice.id },
                include: {
                  penagihan : {
                    include : {
                      distribusiPembayaran : true
                    }
                  }
                },
              });

              let sisaTagihan = 0;

              if (findInvoice) {
                const telahDibayar = findInvoice.penagihan.reduce((tot, cur) => {
                  const pem = cur.distribusiPembayaran.reduce((tot, cur) => {
                    return tot += cur.jumlah
                  }, 0)

                  return tot += pem
                }, 0)
                sisaTagihan = invoice.total - telahDibayar;
              }

              const newDistribusi: Prisma.DistribusiPembayaranCreateInput = {
                penagihan : {
                  connect : {
                    id : penagihan.id
                  }
                },
                caraBayar: {
                  connect: {
                    id: transfer.caraBayarId,
                  },
                },
                jumlah:
                  transfer.caraBayar.total > sisaTagihan ? sisaTagihan : transfer.caraBayar.total,
              };

              await ctx.distribusiPembayaran.create({
                data: newDistribusi,
              });

              totalPembayaran += transfer.caraBayar.total
            }

            if (data.cash) {
              const caraBayar = await ctx.caraBayar.create({
                data: {
                  total: parseInt(data.cash),
                  tandaTerima: data.tanda_terima == "TRUE",
                  metodePembayaranId: 1,
                },
              });

              const findInvoice = await ctx.invoice.findFirst({
                where: { id: invoice.id },
                include: {
                  penagihan : {
                    include : {
                      distribusiPembayaran : true
                    }
                  }
                },
              });

              let sisaTagihan = 0;

              if (findInvoice) {
                const telahDibayar = findInvoice.penagihan.reduce((tot, cur) => {
                  const pem = cur.distribusiPembayaran.reduce((tot, cur) => {
                    return tot += cur.jumlah
                  }, 0)

                  return tot += pem
                }, 0)
                sisaTagihan = invoice.total - telahDibayar;
              }

              const distribusiPembayaran = await ctx.distribusiPembayaran.create({
                data: {
                  penagihanId : penagihan.id,
                  caraBayarId: caraBayar.id,
                  jumlah: caraBayar.total > sisaTagihan ? sisaTagihan : caraBayar.total,
                },
              });
            }
          });

           
          if (!data.cash && !data.transfer_id && !data.giro_id) {
            await prisma.penagihan.update({
              where : {
                id : penagihanId
              },
              data : {
                status : "NIHIL"
              }
            })
          } else {
            const findInvoice = await prisma.invoice.findFirst({
              where: { id: invoiceId },
              include: {
                penagihan : {
                  include : {
                    distribusiPembayaran : true
                  }
                }
              },
            });

            let sisaTagihan = 0;

            if (findInvoice) {
              const telahDibayar = findInvoice.penagihan.reduce((tot, cur) => {
                const pem = cur.distribusiPembayaran.reduce((tot, cur) => {
                  return tot += cur.jumlah
                }, 0)

                return tot += pem
              }, 0)
              sisaTagihan = findInvoice.total - telahDibayar;
            }

            await prisma.penagihan.update({
              where : {id : penagihanId},
              data : {
                status : sisaTagihan - 10 <= totalPembayaran ? "LUNAS" : "CICILAN"
              }
            })
          }
        }
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
