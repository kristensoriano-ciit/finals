import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import ExpenseForm from './ExpenseForm.jsx'

const type = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } })
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Add expense' }))

test('sends a clean expense and clears the form', () => {
  const onAdd = vi.fn()
  render(<ExpenseForm onAdd={onAdd} />)
  type('Description', '  Bus fare ')
  type('Amount', '15.50')
  type('Category', 'Transport')
  submit()
  expect(onAdd).toHaveBeenCalledWith({ description: 'Bus fare', amount: 15.5, category: 'Transport' })
  expect(screen.getByLabelText('Description').value).toBe('')
})

test('shows errors and adds nothing for empty input', () => {
  const onAdd = vi.fn()
  render(<ExpenseForm onAdd={onAdd} />)
  submit()
  expect(screen.getAllByRole('alert')).toHaveLength(2)
  expect(onAdd).not.toHaveBeenCalled()
})
