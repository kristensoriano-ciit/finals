import { describe, expect, test } from 'vitest'
import { validateExpense } from './validateExpense.js'

const valid = { description: 'Lunch', amount: '120.50', category: 'Food' }

describe('validateExpense', () => {
  test('accepts a valid expense', () => {
    expect(validateExpense(valid)).toEqual({ isValid: true, errors: {} })
  })

  test.each(['', '0', '-5', 'abc', '1.234', '1000000.01'])('rejects amount "%s"', (amount) => {
    const result = validateExpense({ ...valid, amount })
    expect(result.isValid).toBe(false)
    expect(result.errors.amount).toBeTruthy()
  })

  test.each(['0.01', '1000000'])('accepts boundary amount %s', (amount) => {
    expect(validateExpense({ ...valid, amount }).isValid).toBe(true)
  })

  test('rejects a blank description', () => {
    expect(validateExpense({ ...valid, description: '   ' }).errors.description).toBe('Description is required.')
  })

  test('limits the description to 60 characters', () => {
    expect(validateExpense({ ...valid, description: 'a'.repeat(60) }).isValid).toBe(true)
    expect(validateExpense({ ...valid, description: 'a'.repeat(61) }).isValid).toBe(false)
  })

  test('rejects an unknown category', () => {
    expect(validateExpense({ ...valid, category: 'Games' }).errors.category).toBeTruthy()
  })
})
