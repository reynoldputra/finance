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
    const result = await prisma.caraBayar.findMany({
      include : {
        metode : true,
        giro : true,
        transfer : true
      }
    });
    return result;
  }

  static async getTransfer() {
    const result = await prisma.transfer.findMany({
      include : {
        caraBayar : {
          include : {
            distribusiPembayaran : true
          }
        }
      }
    });

    return result;
  }

  static async createCaraBayar(input: TCreateCaraBayarInput) {
    let newCaraBayar: Prisma.CaraBayarUncheckedCreateInput = {
      total: input.total,
      tandaTerima: input.tandaTerima,
      metodePembayaranId: 1,
    };

    if (input.pembayaran.giro) {
      newCaraBayar.giro = {
        create: input.pembayaran.giro,
      };
      newCaraBayar.metodePembayaranId = 2;
    } else if (input.pembayaran.transfer) {
      newCaraBayar.transfer = {
        create: input.pembayaran.transfer,
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
      if (input.pembayaran.giro) {
        updateCaraBayar.giro = {
          create: input.pembayaran.giro,
        };
        updateCaraBayar.metodePembayaranId = 2;
      } else if (input.pembayaran.transfer) {
        updateCaraBayar.transfer = {
          create: input.pembayaran.transfer,
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
