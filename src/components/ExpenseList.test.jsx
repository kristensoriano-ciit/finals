import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import ExpenseList from './ExpenseList.jsx'

const list = [
  { id: '1', description: 'Lunch', amount: 100, category: 'Food' },
  { id: '2', description: 'Internet', amount: 50.5, category: 'Bills' },
]

const chooseFilter = (value) =>
  fireEvent.change(screen.getByLabelText('Filter by category'), { target: { value } })

test('shows an empty message', () => {
  render(<ExpenseList expenses={[]} onDelete={() => {}} />)
  expect(screen.getByText('No expenses to show.')).toBeTruthy()
})

test('filters the list and shows both totals', () => {
  render(<ExpenseList expenses={list} onDelete={() => {}} />)
  chooseFilter('Food')
  expect(screen.getByText('Total: 150.50')).toBeTruthy()
  expect(screen.getByText('Food total: 100.00')).toBeTruthy()
  expect(screen.queryByText(/Internet/)).toBeNull()
})

test('shows zero for a category with no expenses', () => {
  render(<ExpenseList expenses={list} onDelete={() => {}} />)
  chooseFilter('School')
  expect(screen.getByText('School total: 0.00')).toBeTruthy()
  expect(screen.getByText('No expenses to show.')).toBeTruthy()
})

test('reports which expense to delete', () => {
  const onDelete = vi.fn()
  render(<ExpenseList expenses={list} onDelete={onDelete} />)
  fireEvent.click(screen.getByRole('button', { name: 'Delete Internet' }))
  expect(onDelete).toHaveBeenCalledWith('2')
})
