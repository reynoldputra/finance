export const roundDecimal = (num: number | string) => {
    if(typeof num === "number" && num % 1 !== 0) {
      return parseFloat(num.toFixed(1))
    } else {
      return num
    }
  }