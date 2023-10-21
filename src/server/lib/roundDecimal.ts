export const roundDecimal = (num: number | string) => {
  if(typeof num == "number" && num % 1 != 0 ) {
    return Number(num.toFixed(1))
  } else if(num !== 0) {
    return num
  } else {
    return Number(num)
  }
}
