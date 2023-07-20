import { CaraBayar, Invoice, PrismaClient } from "../../src/generated/client";
const prisma = new PrismaClient();

async function main() {
  try {
    // where: {
    //   tanggalTagihan: new Date("2023-05-22T17:00:00.000Z");
    // }
    // where: {
    //   invoice: {
    //     customerId: ""
    //   }
    // },
    const res = await prisma.distribusiPembayaran.findMany({
      select: {
        tanggalTagihan: true,
        invoice: {
          select: {
            customer: {
              select: {
                nama: true,
                id: true,
              },
            },
            id: true,
          },
        },
        CaraBayar: true,
      },
    });

    interface Tinvoice {
      invoice_id: string;
      tanggalTagihan: Date;
      customer: {
        nama: string;
        id: string;
      };
      cara_bayar: CaraBayar[];
    }

    interface Tcustomer {
      customer_id: string;
      customer_name: string;
      tanggalTagihan: Date;
      invoices: Invoices[];
    }
    type Invoices = {
      id: string;
      cara_bayar: CaraBayar[];
    };

    const invoiceArray: Tinvoice[] = [];
    const customerArray: Tcustomer[] = [];

    function findInvoiceIndex(id: string): number {
      return invoiceArray.findIndex((item: any) => item.invoice_id === id);
    }

    function findCustomerIndex(id: string): number {
      return customerArray.findIndex(
        (item: Tcustomer) => item.customer_id === id
      );
    }

    res.forEach((item) => {
      const { tanggalTagihan, invoice, CaraBayar } = item;
      const { id, customer } = invoice;
      const existingIndex = findInvoiceIndex(id);
      if (existingIndex !== -1) {
        if (CaraBayar) {
          invoiceArray[existingIndex].cara_bayar.push(CaraBayar);
        }
      } else {
        const newInvoice: Tinvoice = {
          invoice_id: id,
          tanggalTagihan,
          customer,
          cara_bayar: CaraBayar ? [CaraBayar] : [],
        };
        invoiceArray.push(newInvoice);
      }
    });

    invoiceArray.forEach((item) => {
      const { invoice_id, tanggalTagihan, customer, cara_bayar } = item;
      const existingIndex = findCustomerIndex(customer.id);
      if (existingIndex !== -1) {
        customerArray[existingIndex].invoices.push({
          id: invoice_id,
          cara_bayar,
        });
      } else {
        const newCustomer: Tcustomer = {
          customer_id: customer.id,
          customer_name: customer.nama,
          tanggalTagihan,
          invoices: [
            {
              id: invoice_id,
              cara_bayar,
            },
          ],
        };
        customerArray.push(newCustomer);
      }
    });

    // raw from query
    // console.dir(res, { depth: null });

    // show based on invoice
    // console.dir(invoiceArray, { depth: null });

    // show based on customer
    // console.dir(customerArray, { depth: null });
  } catch (err) {
    console.log("Error : ", err);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Testing db done");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
