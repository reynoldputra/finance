export interface ICustomer {
  id: string;
  nama: string;
  alamat: string;
}

export interface ICustomerTable extends ICustomer {
  kolektorId: string;
  kolektorNama: string;
  invoiceAktif: number;
  jumlahTagihan: number;
}
