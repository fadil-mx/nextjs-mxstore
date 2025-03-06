import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type BrowsingHistory = {
  products: { id: string; category: string }[]
}
const initialState: BrowsingHistory = {
  products: [],
}

export const browsingHistoryStore = create<BrowsingHistory>()(
  persist(() => initialState, { name: 'browsinghistoryStore' })
)

export default function useBrowsingHistory() {
  const { products } = browsingHistoryStore()
  return {
    products,
    addItems: (product: { id: string; category: string }) => {
      const index = products.findIndex((p) => p.id === product.id)
      if (index !== -1) products.splice(index, 1) // Remove if already in history
      products.unshift(product) // Add the new product at the start
      if (products.length > 10) products.pop() // Keep only the last 10 items
      browsingHistoryStore.setState({ products }) // Update store
    },
    clear: () => {
      browsingHistoryStore.setState({ products: [] })
    },
  }
}
