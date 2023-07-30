import { PenagihanService } from "../collections/penagihan/penagihanService"

describe("Get all penagihan", () => {
  it("should return all penagihan", async () => {
    const res = await PenagihanService.getAllPenagihan()
    expect(res.length >= 1).toBe(true)
  })
})
