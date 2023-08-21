export const dmyDate = (date : Date) => {
  let d = date.getDate()
  let m = date.getMonth() + 1
  let y = date.getFullYear().toString()

  return `${d}/${m}/${y}`
}

export const parseDmy = (str : string) => {
  const split = str.split("/")
  const dateNumber = split.map(s => parseInt(s))
  const date = new Date(dateNumber[3], dateNumber[1], dateNumber[0])
  return date
}
