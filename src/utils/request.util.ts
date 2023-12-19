export function arrayToStringWithQuotes(arr: (string | number | Date)[]): string {
  const resultArray: string[] = arr.map((item) => {
    if (typeof item === 'string') {
      return `"${item}"`
    } else if (item instanceof Date) {
      return `"${item.toISOString()}"`
    } else {
      return String(item)
    }
  })
  return resultArray.join(', ')
}
