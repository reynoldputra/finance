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
      kolektorId: "clkmtkznl0001umjwmdxlqpq5",
    };
  });

  afterAll(async () => {
    if (newCustomer.id) await CustomerService.deleteCustomer(newCustomer.id);
  });

  it("return customer", async () => {
    const result = await CustomerService.createCustomer(newCustomer);
    expect(result.id).toEqual(newCustomer.id);
    expect(result.nama).toEqual(newCustomer.nama);
    // expect(result.kolektorId).toEqual(newCustomer.kolektorId);
  });
});

describe("Delete Customer", (): void => {
  let newCustomer: TCreateCustomerInput;

  beforeAll(async () => {
    newCustomer = {
      id: "asdfasdf",
      nama: "wika",
      kolektorId: "clkmtkzvy0078umjw6mdcppcj",
    };
    await CustomerService.createCustomer(newCustomer);
  });

  it("delete one customer", async () => {
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

describe("Update Customer", (): void => {
  let newCustomer: TCreateCustomerInput;

  beforeAll(async () => {
    newCustomer = {
      id: "asdfasdf",
      nama: "wika",
      kolektorId: "clkmtkzvy0078umjw6mdcppcj",
    };
    await CustomerService.createCustomer(newCustomer);
  });

  afterAll(async () => {
    if (newCustomer.id) await CustomerService.deleteCustomer(newCustomer.id);
  });

  it("update customer", async () => {
    expect(newCustomer).toBeTruthy();
    if (newCustomer.id) {
      // change name & kolektorId
      let updateCostumer: TUpdateCustomerInput = {
        id: newCustomer.id,
        nama: "wika updated",
        kolektorId: "clkmtkznl0001umjwmdxlqpq5",
      };
      const res = await CustomerService.updateCostumer(updateCostumer);
      expect(res.id).toEqual(updateCostumer.id);
      expect(res.nama).toEqual(updateCostumer.nama);
      //   expect(res.kolektorId).toEqual(updateCostumer.kolektorId);
    }
  });
});
