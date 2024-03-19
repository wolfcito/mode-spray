export function addressFormatter(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}
