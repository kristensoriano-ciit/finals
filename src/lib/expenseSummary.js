// Add in cents so that 0.1 + 0.2 gives exactly 0.3
export function getTotal(expenses) {
  const cents = expenses.reduce((sum, e) => sum + Math.round(e.amount * 100), 0)
  return cents
}

export function filterByCategory(expenses, category) {
  if (category === 'All') return expenses
  return expenses.filter((e) => e.category === category)
}
