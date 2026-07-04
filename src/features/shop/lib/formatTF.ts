/** Formatea una cantidad de TokaFeed con separadores de miles. */
export function formatTF(n: number): string {
  return n.toLocaleString('en-US')
}
