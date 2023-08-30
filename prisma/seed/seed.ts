import { PrismaClient, Prisma } from "../../src/generated/client";
const csvParser = require("csv-parser");
import * as fs from "fs";
import * as path from "path";
const prisma = new PrismaClient();

async function main() {
  const metodePembayaran: Prisma.MetodePembayaranUncheckedCreateInput[] = [
    { id: 1, jenis: "CASH", batasAtas : 1000, batasBawah : 1000},
    { id: 2, jenis: "GIRO", batasAtas : 10000, batasBawah : 1000 },
    { id: 3, jenis: "TRANSFER", batasAtas : 10000, batasBawah : 1000 },
  ];

  await prisma.$queryRawUnsafe(`DELETE FROM kolektor_history`);
  await prisma.$queryRawUnsafe(`DELETE FROM giro;`);
  await prisma.$queryRawUnsafe(`DELETE FROM transfer;`);
  await prisma.$queryRawUnsafe(`DELETE FROM distribusi_pembayaran;`);
  await prisma.$queryRawUnsafe(`DELETE FROM cara_bayar;`);
  await prisma.$queryRawUnsafe(`DELETE FROM penagihan`);
  await prisma.$queryRawUnsafe(`DELETE FROM invoice`);

  for (let idx in metodePembayaran) {
    const m = metodePembayaran[idx];
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
          // console.log(idx);
          const data = allData[idx];

          if (data.nama_customer) currentCustName = data.nama_customer;
          if (data.nama_sales) salesName = data.nama_sales;
          if (data.nama_kolektor) colectorName = data.nama_kolektor;
          let totalPembayaran = 0;
          let invoiceId = "";
          let penagihanId = "";

          await prisma.$transaction(async (ctx) => {
            const newKolektor: Prisma.KolektorCreateInput = {
              nama: colectorName,
            };

            const kolektor = await ctx.kolektor.upsert({
              where: { nama: colectorName },
              create: newKolektor,
              update: newKolektor,
            });

            // creating customer
            const newCust: Prisma.CustomerCreateWithoutInvoicesInput = {
              nama: data.nama_customer ? data.nama_customer : (currentCustName as string),
              currentKolektor: {
                connect: {
                  id: kolektor.id,
                },
              },
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
              include: {
                kolektor: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            });

            if (daftarCollector.length) {
              if (colectorName != daftarCollector[0].kolektor.nama) {
                await ctx.kolektorHistory.create({
                  data: {
                    kolektorId: kolektor.id,
                    customerId: customer.id,
                  },
                });
                await ctx.customer.update({
                  where: { id: customer.id },
                  data: {
                    kolektorId: kolektor.id,
                  },
                });
              }
            } else {
              await ctx.kolektorHistory.create({
                data: {
                  kolektorId: kolektor.id,
                  customerId: customer.id,
                },
              });
            }

            // creating invoice
            let tanggalTransaksi = data.tanggal_transaksi + "/2023";
            const [day, month, year] = tanggalTransaksi.split("/");
            const tanggal_transaksi = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            const newInvoice: Prisma.InvoiceCreateInput = {
              transaksiId: data.transaksi_id,
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
              where: { transaksiId: data.transaksi_id },
              create: newInvoice,
              update: newInvoice,
              include : {
                penagihan : {
                  include : {
                    distribusiPembayaran : true
                  }
                }
              }
            });
            invoiceId = invoice.id;

            const jatuhTempo = data.jatuh_tempo + "/2023";
            const [dayJt, monthJt, yearJt] = jatuhTempo.split("/");
            const jatuhTempoDate = new Date(
              parseInt(yearJt),
              parseInt(monthJt) - 1,
              parseInt(dayJt)
            );

            let tanggal_tagihan = data.tanggal_tagihan;
            let [d, m, y] = tanggal_tagihan.split("/");
            if (!y) y = 2023;
            const tanggalTagihanDate = new Date(parseInt(y), parseInt(m) - 1 , parseInt(d) );

            const terbayar = invoice.penagihan.reduce((t,c) => {
              const totaldistribusi = c.distribusiPembayaran.reduce((t2, c2) => {
                return t2 += Number(c2.jumlah)
              }, 0)
              return t += totaldistribusi
            }, 0)

            const penagihan = await ctx.penagihan.create({
              data: {
                tanggalTagihan: tanggalTagihanDate,
                invoiceId: invoice.id,
                kolektorId: kolektor.id,
                status: "WAITING",
                sisa :  Number(invoice.total) - terbayar
              },
            });

            penagihanId = penagihan.id;

            if (data.giro_id) {
              let newGiro: Prisma.GiroCreateWithoutCaraBayarInput | Prisma.GiroCreateInput = {
                id: data.giro_id,
                bank: data.giro_bank as string,
                nomor: data.no_giro,
                jatuhTempo: jatuhTempoDate,
              };

              let codepembayaran = "G";
              codepembayaran += penagihan.tanggalTagihan.getFullYear().toString().slice(-2);
              let codeMonth = penagihan.tanggalTagihan.getMonth() + 1;
              if (codeMonth < 10) {
                codepembayaran += `0${codeMonth}`;
              } else {
                codepembayaran += `${codeMonth}`;
              }

              let codeDate = penagihan.tanggalTagihan.getDate();
              if (codeDate < 10) {
                codepembayaran += `0${codeDate}`;
              } else {
                codepembayaran += `${codeDate}`;
              }

              const carabayargiro = await ctx.caraBayar.findMany({
                where: {
                  tanggal: penagihan.tanggalTagihan,
                  metodePembayaranId: 2,
                },
              });

              codepembayaran += `-${carabayargiro.length + 1}`;

              const findGiro = await ctx.giro.findFirst({
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
                      id: codepembayaran,
                      total: parseInt(data.giro_amount),
                      tandaTerima: data.tanda_terima == "TRUE",
                      tanggal: penagihan.tanggalTagihan,
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
                  penagihan: {
                    include: {
                      distribusiPembayaran: true,
                    },
                  },
                },
              });

              let sisaTagihan = 0;

              if (findInvoice) {
                const telahDibayar = findInvoice.penagihan.reduce((tot, cur) => {
                  const pem = cur.distribusiPembayaran.reduce((tot, cur) => {
                    return (tot +=  Number(cur.jumlah));
                  }, 0);

                  return (tot += pem);
                }, 0);
                sisaTagihan =  Number(invoice.total) - telahDibayar;
              }

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

              totalPembayaran +=  Number(giro.caraBayar.total);
              console.log(codepembayaran);
            }

            if (data.transfer_id) {
              let newTransfer:
                | Prisma.TransferCreateInput
                | Prisma.TransferCreateWithoutCaraBayarInput = {
                id: data.transfer_id,
                bank: "BCA",
              };

              const findTransfer = await ctx.transfer.findFirst({
                where: {
                  id: newTransfer.id,
                },
                include: {
                  caraBayar: true,
                },
              });

              let codepembayaran = "T";
              let ttagihan = penagihan.tanggalTagihan
              codepembayaran += ttagihan.getFullYear().toString().slice(-2);
              let codeMonth = ttagihan.getMonth() + 1;
              if (codeMonth < 10) {
                codepembayaran += `0${codeMonth}`;
              } else {
                codepembayaran += `${codeMonth}`;
              }

              let codeDate = ttagihan.getDate();
              if (codeDate < 10) {
                codepembayaran += `0${codeDate}`;
              } else {
                codepembayaran += `${codeDate}`;
              }

              const carabayarTransfer = await ctx.caraBayar.findMany({
                where: {
                  tanggal: ttagihan,
                  metodePembayaranId: 3,
                },
              });

              codepembayaran += `-${carabayarTransfer.length + 1}`;

              let transferId: string;
              let carabayarId: string;
              let total: number;

              if (findTransfer) {
                carabayarId = findTransfer.caraBayarId;
                transferId = findTransfer.id;
                total =  Number(findTransfer.caraBayar.total);
              } else {
                newTransfer = {
                  ...newTransfer,
                  caraBayar: {
                    create: {
                      id: codepembayaran,
                      total: parseInt(data.transfer_amount),
                      tandaTerima: data.tanda_terima == "TRUE",
                      tanggal: penagihan.tanggalTagihan,
                      metodePembayaranId: 3,
                    },
                  },
                };

                const createNewTf = await ctx.transfer.create({
                  data: newTransfer,
                  include: {
                    caraBayar: true,
                  },
                });

                transferId = createNewTf.id;
                carabayarId = createNewTf.caraBayarId;
                total =  Number(createNewTf.caraBayar.total);
              }

              const findInvoice = await ctx.invoice.findFirst({
                where: { id: invoice.id },
                include: {
                  penagihan: {
                    include: {
                      distribusiPembayaran: true,
                    },
                  },
                },
              });

              let sisaTagihan = 0;

              if (findInvoice) {
                const telahDibayar = findInvoice.penagihan.reduce((tot, cur) => {
                  const pem = cur.distribusiPembayaran.reduce((tot, cur) => {
                    return (tot +=  Number(cur.jumlah));
                  }, 0);

                  return (tot += pem);
                }, 0);
                sisaTagihan =  Number(invoice.total) - telahDibayar;
              }

              const newDistribusi: Prisma.DistribusiPembayaranCreateInput = {
                penagihan: {
                  connect: {
                    id: penagihan.id,
                  },
                },
                caraBayar: {
                  connect: {
                    id: carabayarId,
                  },
                },
                jumlah:
                  total > sisaTagihan ? sisaTagihan : total,
              };

              await ctx.distribusiPembayaran.create({
                data: newDistribusi,
              });

              totalPembayaran += total;
              console.log(codepembayaran);
            }

            if (data.cash) {
              let codepembayaran = "C";
              codepembayaran += penagihan.tanggalTagihan.getFullYear().toString().slice(-2);
              let codeMonth = penagihan.tanggalTagihan.getMonth() + 1;
              if (codeMonth < 10) {
                codepembayaran += `0${codeMonth}`;
              } else {
                codepembayaran += `${codeMonth}`;
              }

              let codeDate = penagihan.tanggalTagihan.getDate();
              if (codeDate < 10) {
                codepembayaran += `0${codeDate}`;
              } else {
                codepembayaran += `${codeDate}`;
              }

              const carabayarCash = await ctx.caraBayar.findMany({
                where: {
                  tanggal: penagihan.tanggalTagihan,
                  metodePembayaranId: 1,
                },
              });

              codepembayaran += `-${carabayarCash.length + 1}`;

              const caraBayar = await ctx.caraBayar.create({
                data: {
                  id: codepembayaran,
                  total: parseInt(data.cash),
                  tandaTerima: data.tanda_terima == "TRUE",
                  tanggal: penagihan.tanggalTagihan,
                  metodePembayaranId: 1,
                },
              });

              const findInvoice = await ctx.invoice.findFirst({
                where: { id: invoice.id },
                include: {
                  penagihan: {
                    include: {
                      distribusiPembayaran: true,
                    },
                  },
                },
              });

              let sisaTagihan = 0;

              if (findInvoice) {
                const telahDibayar = findInvoice.penagihan.reduce((tot, cur) => {
                  const pem = cur.distribusiPembayaran.reduce((tot, cur) => {
                    return (tot +=  Number(cur.jumlah));
                  }, 0);

                  return (tot += pem);
                }, 0);
                sisaTagihan =  Number(invoice.total)- telahDibayar;
              }
              console.log(codepembayaran);

              const distribusiPembayaran = await ctx.distribusiPembayaran.create({
                data: {
                  penagihanId: penagihan.id,
                  caraBayarId: caraBayar.id,
                  jumlah: caraBayar.total > sisaTagihan ? sisaTagihan : caraBayar.total,
                },
              });
            }
          });

          if (!data.cash && !data.transfer_id && !data.giro_id) {
            await prisma.penagihan.update({
              where: {
                id: penagihanId,
              },
              data: {
                status: "NIHIL",
              },
            });
          } else {
            const findInvoice = await prisma.invoice.findFirst({
              where: { id: invoiceId },
              include: {
                penagihan: {
                  include: {
                    distribusiPembayaran: true,
                  },
                },
              },
            });

            let sisaTagihan = 0;

            if (findInvoice) {
              const telahDibayar = findInvoice.penagihan.reduce((tot, cur) => {
                const pem = cur.distribusiPembayaran.reduce((tot, cur) => {
                  return (tot +=  Number(cur.jumlah));
                }, 0);

                return (tot += pem);
              }, 0);
              sisaTagihan =  Number(findInvoice.total) - telahDibayar;
            }

            await prisma.penagihan.update({
              where: { id: penagihanId },
              data: {
                status: sisaTagihan - 10 <= totalPembayaran ? "LUNAS" : "CICILAN",
              },
            });
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
