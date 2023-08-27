export default function toPascalCase(str: string) {
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
    const lower = arr[i].toLowerCase()
    arr[i] = lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  const str2 = arr.join(" ");
  return str2
}
