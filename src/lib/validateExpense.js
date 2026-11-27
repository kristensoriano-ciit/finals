import { CATEGORIES } from './categories.js'

export function validateExpense({ description, amount, category }) {
  const errors = {}
  const name = String(description ?? '').trim()
  const rawAmount = String(amount ?? '').trim()

  if (!name) errors.description = 'Description is required.'
  else if (name.length > 60) errors.description = 'Use 60 characters or fewer.'

  if (!/^\d+(\.\d{1,2})?$/.test(rawAmount)) {
    errors.amount = 'Enter a number with up to 2 decimal places.'
  } else if (Number(rawAmount) <= 0) {
    errors.amount = 'Amount must be greater than 0.'
  } else if (Number(rawAmount) > 1000000) {
    errors.amount = 'Amount cannot exceed 1,000,000.'
  }

  if (!CATEGORIES.includes(category)) errors.category = 'Choose a category.'

  return { isValid: Object.keys(errors).length === 0, errors }
}
