import { Prisma } from "@server/../generated/client";
import { prisma } from "@server/prisma";
import {
  createGiroInput,
  createTransferInput,
  TCreateCaraBayarInput,
  TCreateGiroInput,
  TCreateTransferInput,
  TUpdateCaraBayarInput,
} from "./caraBayarSchema";

export class CaraBayarService {
  static async getCaraBayar() {
    const result = await prisma.caraBayar.findMany();
    return result;
  }

  static async createCaraBayar(input: TCreateCaraBayarInput) {
    let newCaraBayar: Prisma.CaraBayarUncheckedCreateInput = {
      total: input.total,
      tandaTerima: input.tandaTerima,
      metodePembayaranId: 1,
    };

    if (createGiroInput.safeParse(input.pembayaran).success) {
      newCaraBayar.giro = {
        create: input.pembayaran as TCreateGiroInput,
      };
      newCaraBayar.metodePembayaranId = 2;
    } else if (createTransferInput.safeParse(input.pembayaran).success) {
      newCaraBayar.transfer = {
        create: input.pembayaran as TCreateTransferInput,
      };
      newCaraBayar.metodePembayaranId = 3;
    }

    const result = await prisma.caraBayar.create({
      data: newCaraBayar,
    });

    return result;
  }

  static async deleteCaraBayar(id: string) {
    const result = await prisma.caraBayar.delete({
      where: {
        id,
      },
    });

    return result;
  }

  static async updateCaraBayar(input: TUpdateCaraBayarInput) {
    let updateCaraBayar: Prisma.CaraBayarUncheckedUpdateInput = {};

    if (input.total) {
      updateCaraBayar = {
        total: input.total,
        metodePembayaranId: 1,
      };
    }

    if (input.pembayaran) {
      if (createGiroInput.safeParse(input.pembayaran).success) {
        updateCaraBayar.giro = {
          create: input.pembayaran as TCreateGiroInput,
        };
        updateCaraBayar.metodePembayaranId = 2;
      } else if (createTransferInput.safeParse(input.pembayaran).success) {
        updateCaraBayar.transfer = {
          create: input.pembayaran as TCreateTransferInput,
        };
        updateCaraBayar.metodePembayaranId = 3;
      }
    }

    if (input.tandaTerima) {
      updateCaraBayar.tandaTerima = input.tandaTerima;
    }

    const result = await prisma.caraBayar.update({
      where: {
        id: input.id,
      },
      data: updateCaraBayar,
    });

    return result;
  }
}
