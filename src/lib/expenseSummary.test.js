import { expect, test } from 'vitest'
import { filterByCategory, getTotal } from './expenseSummary.js'

const list = [
  { amount: 0.1, category: 'Food' },
  { amount: 0.2, category: 'Bills' },
]

test('adds money without rounding errors', () => {
  expect(getTotal(list)).toBe(0.3)
})

test('returns zero for an empty list', () => {
  expect(getTotal([])).toBe(0)
})

test('filters by category, including All and no match', () => {
  expect(filterByCategory(list, 'Food')).toEqual([list[0]])
  expect(filterByCategory(list, 'All')).toEqual(list)
  expect(filterByCategory(list, 'School')).toEqual([])
})
