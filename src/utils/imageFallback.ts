export function getProductImage(productId: string | number, imageUrl?: string | null): string {
  if (imageUrl) {
    return imageUrl;
  }
  // Use picsum.photos with the product ID as a seed to ensure stable image assignments
  // We use 800x600 as a standard size for product images
  return `https://picsum.photos/seed/${productId}/800/600`;
}
