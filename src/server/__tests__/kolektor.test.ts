import { expect, describe, it } from "@jest/globals";
import {
  TCreateKolektorInput,
  TUpdateKolektorInput,
} from "@server/collections/kolektor/kolektorSchema";
import { KolektorService } from "@server/collections/kolektor/kolektorService";

describe("Get All Kolektor", (): void => {
  it("return invoices", async () => {
    const res = await KolektorService.getAllKolektor();
    expect(res.length >= 1).toBe(true);
  });
});

describe("Create Kolektor", (): void => {
  let newKolektor: TCreateKolektorInput;

  afterAll(async () => {
    if (newKolektor.id) await KolektorService.deleteKolektor(newKolektor.id);
  });

  it("return kolektor", async () => {
    newKolektor = {
      id: "assdwqefc",
      nama: "inu",
    };
    const result = await KolektorService.createKolektor(newKolektor);
    expect(result.id).toEqual(newKolektor.id);
    expect(result.nama).toEqual(newKolektor.nama);
  });
});

describe("Delete Kolektor", (): void => {
  let newKolektor: TCreateKolektorInput;

  beforeAll(async () => {
    newKolektor = {
      id: "asdfasdf",
      nama: "wika",
    };
    await KolektorService.createKolektor(newKolektor);
  });

  it("delete one invoice", async () => {
    expect(newKolektor.id).toBeTruthy();
    const allKolektorBefore = await KolektorService.getAllKolektor();
    if (newKolektor.id) {
      const res = await KolektorService.deleteKolektor(newKolektor.id);
      const allKolektorAfter = await KolektorService.getAllKolektor();
      expect(allKolektorBefore.length - 1).toEqual(allKolektorAfter.length);
    }
  });
});

describe("Update Invoice", (): void => {
  let newKolektor: TCreateKolektorInput;

  beforeAll(async () => {
    newKolektor = {
      id: "asdfasdf",
      nama: "wika",
    };
    await KolektorService.createKolektor(newKolektor);
  });

  afterAll(async () => {
    if (newKolektor.id) await KolektorService.deleteKolektor(newKolektor.id);
  });

  it("update invoice", async () => {
    expect(newKolektor).toBeTruthy();
    if (newKolektor.id) {
      // change name & currentKolektor
      let updateKolektor: TUpdateKolektorInput = {
        id: newKolektor.id,
        nama: "wika updated",
      };
      const res = await KolektorService.updateKolektor(updateKolektor);
      expect(res.id).toEqual(updateKolektor.id);
      expect(res.nama).toEqual(updateKolektor.nama);
    }
  });
});
