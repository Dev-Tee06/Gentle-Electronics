import type { CartItem } from '../context/CartContext'

export const BUSINESS_WHATSAPP_NUMBER = '2347061158745' // 07061158745 with country code 234

export const generateOrderId = (): string => {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  // For MVP client-side generation, we use a random sequence to avoid collisions if we don't have a backend sequence setup yet.
  // The PRD mentions an atomic sequence in Supabase, which we will use later, but for now we generate a random 3 digit number to satisfy the client side click flow immediately, or we can just fetch from a sequence.
  // To match PRD: GE-YYYYMMDD-NNN. We'll use a random NNN for now, or fetch from DB in the component.
  const nnn = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  return `GE-${yyyy}${mm}${dd}-${nnn}`
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const generateWhatsAppMessage = (
  orderId: string,
  cart: CartItem[],
  totalAmount: number
): string => {
  let message = `Hello Gentle Electronics,\n\nI would like to place an order.\n\nOrder ID: ${orderId}\n\n`
  
  cart.forEach((item) => {
    message += `${item.name}\n`
    message += `    Quantity: ${item.quantity}\n`
    message += `    Unit Price: ${formatCurrency(item.price)}\n`
    message += `    Subtotal: ${formatCurrency(item.price * item.quantity)}\n\n`
  })

  message += `Total: ${formatCurrency(totalAmount)}\n\n`
  message += `Customer Name: \n`
  message += `Delivery Location: \n\n`
  message += `Please confirm availability and payment details.\n\nThank you.`

  return message
}

export const getWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodedMessage}`
}
