import { useState } from 'react'

export function useCollectionReactionsUi() {
  const [page, setPage] = useState(0)

  return {
    page,
    setPage,
  }
}
