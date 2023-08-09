export const dmyDate = (date : Date) => {
  let d = date.getDate()
  let m = date.getMonth() + 1
  let y = date.getFullYear().toString().slice(-2)

  return `${d}/${m}/${y}`
}
