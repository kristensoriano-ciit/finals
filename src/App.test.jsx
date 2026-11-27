import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App.jsx'

test('shows the app title', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Expense Tracker' })).toBeTruthy()
})

test('adds, keeps and deletes an expense', () => {
  const first = render(<App />)
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Notebook' } })
  fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '45' } })
  fireEvent.click(screen.getByRole('button', { name: 'Add expense' }))
  expect(screen.getByText('Total: 45.00')).toBeTruthy()
  first.unmount()
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Delete Notebook' }))
  expect(screen.getByText('Total: 0.00')).toBeTruthy()
})

test('starts empty when saved data is damaged', () => {
  localStorage.setItem('expenses', 'not json')
  render(<App />)
  expect(screen.getByText('No expenses to show.')).toBeTruthy()
})
