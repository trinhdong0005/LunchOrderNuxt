export const useBasketQty = () => {
  return useState<number>('basketQty', () => 0)
}
