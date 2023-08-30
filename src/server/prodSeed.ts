import { PrismaClient, Prisma } from "../../src/generated/client";

export default async function prodSeeder(prisma: PrismaClient) {
  const metodePembayaran: Prisma.MetodePembayaranUncheckedCreateInput[] = [
    { id: 1, jenis: "CASH", batasAtas: 1000, batasBawah: 1000 },
    { id: 2, jenis: "GIRO", batasAtas: 10000, batasBawah: 1000 },
    { id: 3, jenis: "TRANSFER", batasAtas: 10000, batasBawah: 1000 },
  ];
  for (let idx in metodePembayaran) {
    const m = metodePembayaran[idx];
    await prisma.metodePembayaran.upsert({
      where: { id: m.id },
      create: m,
      update: m,
    });
  }
}
