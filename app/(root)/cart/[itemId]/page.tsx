import CartItemAdd from './cart-item-add'

export default async function CartAddItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>
}) {
  const { itemId } = await params
  return <CartItemAdd itemId={itemId} />
}
