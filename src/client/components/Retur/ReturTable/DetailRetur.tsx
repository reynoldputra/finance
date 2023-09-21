import { Fragment } from "react"

interface DetailRetur {
  transaksiId : string,
  invoiceId : string,
  total : number
}

interface DetailReturProps {
  invoice : DetailRetur[]
}

export default function DetailRetur ({invoice} : DetailReturProps) {
  return (
    <div className="grid grid-cols-2">
      <p className="font-bold">
        Transaksi ID
      </p>
      <p className="font-bold">
        Total
      </p>
      {
        invoice.map((v, idx) => {
          return (
            <Fragment key={idx}>
              <p>{v.transaksiId}</p>
              <p>{v.total}</p>
            </Fragment>
          )
        })
      }
    </div>
  )
}
