import { expect, describe, it } from "@jest/globals";
import {
  TCreateCustomerInput,
  TUpdateCustomerInput,
} from "@server/collections/customer/customerSchema";
import { CustomerService } from "@server/collections/customer/customerService";

describe("Create Customer", (): void => {
  let newCustomer: TCreateCustomerInput;

  beforeAll(async () => {
    newCustomer = {
      id: "asdfasdf",
      nama: "bagyo",
      currentKolektor: "clkmtkznl0001umjwmdxlqpq5",
    };
  });

  afterAll(async () => {
    if (newCustomer.id) await CustomerService.deleteCustomer(newCustomer.id);
  });

  it("return customer", async () => {
    const result = await CustomerService.createCustomer(newCustomer);
    expect(result.id).toEqual(newCustomer.id);
    expect(result.nama).toEqual(newCustomer.nama);
    // expect(result.currentKolektor).toEqual(newCustomer.currentKolektor);
  });
});

describe("Delete Customer", (): void => {
  let newCustomer: TCreateCustomerInput;

  beforeAll(async () => {
    newCustomer = {
      id: "asdfasdf",
      nama: "wika",
      currentKolektor: "clkmtkzvy0078umjw6mdcppcj",
    };
    await CustomerService.createCustomer(newCustomer);
  });

  it("delete one invoice", async () => {
    expect(newCustomer.id).toBeTruthy();
    const allCustomerBefore = await CustomerService.getAllCustomer();
    if (newCustomer.id) {
      const res = await CustomerService.deleteCustomer(newCustomer.id);
      //   expect(res.id).toEqual(newCustomer.id);
      const allCustomerAfter = await CustomerService.getAllCustomer();
      expect(allCustomerBefore.length - 1).toEqual(allCustomerAfter.length);
    }
  });
});

describe("Update Invoice", (): void => {
  let newCustomer: TCreateCustomerInput;

  beforeAll(async () => {
    newCustomer = {
      id: "asdfasdf",
      nama: "wika",
      currentKolektor: "clkmtkzvy0078umjw6mdcppcj",
    };
    await CustomerService.createCustomer(newCustomer);
  });

  afterAll(async () => {
    if (newCustomer.id) await CustomerService.deleteCustomer(newCustomer.id);
  });

  it("update invoice", async () => {
    expect(newCustomer).toBeTruthy();
    if (newCustomer.id) {
      // change name & currentKolektor
      let updateCostumer: TUpdateCustomerInput = {
        id: newCustomer.id,
        nama: "wika updated",
        currentKolektor: "clkmtkznl0001umjwmdxlqpq5",
      };
      const res = await CustomerService.updateCostumer(updateCostumer);
      expect(res.id).toEqual(updateCostumer.id);
      expect(res.nama).toEqual(updateCostumer.nama);
      //   expect(res.currentKolektor).toEqual(updateCostumer.currentKolektor);
    }
  });
});
