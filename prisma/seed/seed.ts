import { PrismaClient, Prisma } from "../../src/generated/client";
import * as csv from "csv-parser";
import * as fs from "fs";
import * as path from "path";
const prisma = new PrismaClient();

async function main() {
  const metodePembayaran: Prisma.MetodePembayaranUncheckedCreateInput[] = [
    { id: 1, jenis: "CASH" },
    { id: 2, jenis: "GIRO" },
    { id: 3, jenis: "TRANSFER" },
  ];

  console.log("Deleting cara_bayar and distribusi_pembayaran ... ");
  await prisma.$queryRawUnsafe(`DELETE FROM giro;`);
  await prisma.$queryRawUnsafe(`DELETE FROM transfer;`);
  await prisma.$queryRawUnsafe(`DELETE FROM cara_bayar;`);
  await prisma.$queryRawUnsafe(`DELETE FROM distribusi_pembayaran;`);
  await prisma.$queryRawUnsafe(`DELETE FROM invoice`);

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
      .pipe(csv())
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

          await prisma.$transaction(async (ctx) => {
            // creating customer
            const newCust: Prisma.CustomerCreateWithoutInvoicesInput = {
              nama: data.nama_customer ? data.nama_customer : (currentCustName as string),
            };

            const customer = await ctx.customer.upsert({
              where: {
                nama: currentCustName,
              },
              update: newCust,
              create: newCust,
            });

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

            let totalPembayaranSatuTagihan = 0;
            const jatuhTempo = data.jatuh_tempo + "/2023";
            const [dayJt, monthJt, yearJt] = jatuhTempo.split("/");
            const jatuhTempoDate = new Date(
              parseInt(yearJt),
              parseInt(monthJt) - 1,
              parseInt(dayJt)
            );

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
                  CaraBayar: {
                    connect: {
                      id: findGiro.caraBayarId,
                    },
                  },
                };
              } else {
                newGiro = {
                  ...newGiro,
                  CaraBayar: {
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
                  CaraBayar: true,
                },
              });

              const findInvoice = await ctx.invoice.findFirst({
                where: { id: invoice.id },
                include: {
                  distribusiPembayaran: true,
                },
              });

              let sisaTagihan = 0;

              if (findInvoice) {
                let telahDibayar = findInvoice.distribusiPembayaran.reduce(
                  (total, curr) => (total += curr.jumlah),
                  0
                );
                sisaTagihan = invoice.total - telahDibayar - totalPembayaranSatuTagihan;
              }

              totalPembayaranSatuTagihan += data.giro_amount;

              let tanggal_tagihan = data.tanggal_tagihan;
              const [day, month, year] = tanggal_tagihan.split("/");
              const tanggalTagihanDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              );

              const distribusiPembayaran = await ctx.distribusiPembayaran.create({
                data: {
                  invoiceId: invoice.id,
                  caraBayarId: giro.caraBayarId,
                  jumlah: giro.CaraBayar.total > sisaTagihan ? sisaTagihan : giro.CaraBayar.total,
                  status: sisaTagihan - giro.CaraBayar.total <= 100 ? "LUNAS" : "CICILAN",
                  tanggalTagihan: tanggalTagihanDate,
                  namaKolektor: colectorName,
                  keterangan : data.keterangan
                },
                include: {
                  CaraBayar: {
                    include: {
                      Giro: true,
                    },
                  },
                },
              });
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
                  CaraBayar : {
                    connect : {
                      id : findTransfer.caraBayarId
                    }
                  }
                }
              } else {
                newTransfer = {
                  ...newTransfer,
                  CaraBayar: {
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
                  CaraBayar: true,
                },
              });

              const findInvoice = await ctx.invoice.findFirst({
                where: { id: invoice.id },
                include: {
                  distribusiPembayaran: true,
                },
              });

              let sisaTagihan = 0;

              if (findInvoice) {
                let telahDibayar = findInvoice.distribusiPembayaran.reduce(
                  (total, curr) => (total += curr.jumlah),
                  0
                );
                sisaTagihan = invoice.total - telahDibayar - totalPembayaranSatuTagihan;
              }

              totalPembayaranSatuTagihan += data.transfer_amount;

              let tanggal_tagihan = data.tanggal_tagihan;
              const [day, month, year] = tanggal_tagihan.split("/");
              const tanggalTagihanDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              );

              const newDistribusi: Prisma.DistribusiPembayaranCreateInput = {
                tanggalTagihan: tanggalTagihanDate,
                invoice: {
                  connect: {
                    id: invoice.id,
                  },
                },
                CaraBayar: {
                  connect: {
                    id: transfer.caraBayarId,
                  },
                },
                jumlah:
                  transfer.CaraBayar.total > sisaTagihan ? sisaTagihan : transfer.CaraBayar.total,
                status: sisaTagihan - transfer.CaraBayar.total <= 100 ? "LUNAS" : "CICILAN",
                namaKolektor: colectorName,
                keterangan : data.keterangan
              };

              await ctx.distribusiPembayaran.create({
                data: newDistribusi,
              });
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
                  distribusiPembayaran: true,
                },
              });

              let sisaTagihan = 0;

              if (findInvoice) {
                let telahDibayar = findInvoice.distribusiPembayaran.reduce(
                  (total, curr) => (total += curr.jumlah),
                  0
                );
                sisaTagihan = invoice.total - telahDibayar - totalPembayaranSatuTagihan;
              }

              totalPembayaranSatuTagihan += data.cash;
              let tanggal_tagihan = data.tanggal_tagihan;
              const [day, month, year] = tanggal_tagihan.split("/");
              const tanggalTagihanDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              );

              const distribusiPembayaran = await ctx.distribusiPembayaran.create({
                data: {
                  invoiceId: invoice.id,
                  caraBayarId: caraBayar.id,
                  jumlah: caraBayar.total > sisaTagihan ? sisaTagihan : caraBayar.total,
                  status: sisaTagihan - caraBayar.total <= 100 ? "LUNAS" : "CICILAN",
                  tanggalTagihan: tanggalTagihanDate.toISOString(),
                  namaKolektor: colectorName,
                  keterangan : data.keterangan
                },
              });
            }

            if(!data.cash && !data.transfer_id && !data.giro_id) {
              console.log("nihil")
              let tanggal_tagihan = data.tanggal_tagihan;
              const [day, month, year] = tanggal_tagihan.split("/");
              const tanggalTagihanDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              );
              const distribusi = await ctx.distribusiPembayaran.create({
                data : {
                  invoiceId: invoice.id,
                  jumlah: 0,
                  status: "NIHIL",
                  tanggalTagihan: tanggalTagihanDate.toISOString(),
                  namaKolektor: colectorName,
                  keterangan : data.keterangan
                }
              })
            }
          });
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
