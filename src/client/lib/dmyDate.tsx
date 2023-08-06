export const dmyDate = (date : Date) => {
  const d = date.getDate()
  const m = date.getMonth() + 1
  const y = date.getFullYear()
  return `${d}-${m}-${y}`
}
