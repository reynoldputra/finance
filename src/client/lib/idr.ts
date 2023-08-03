export const idr = (input : unknown) => {
  if (typeof input === 'number' && !isNaN(input)) {
    return input.toLocaleString();
  } else if (typeof input === 'string' && !isNaN(parseFloat(input))) {
    return parseInt(input).toLocaleString();
  } else {
    return 'NaN';
  }
}
