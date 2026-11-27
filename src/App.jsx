import { useEffect, useState } from 'react'
import ExpenseForm from './components/ExpenseForm.jsx'
import ExpenseList from './components/ExpenseList.jsx'

const KEY = 'expenses'

function loadExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(saved) ? saved.filter((e) => Number.isFinite(e?.amount)) : []
  } catch {
    return []
  }
}

export default function App() {
  const [expenses, setExpenses] = useState(loadExpenses)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(expenses))
    } catch {
      // the app still works if the browser blocks storage
    }
  }, [expenses])

  function addExpense(expense) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setExpenses((current) => [...current, { ...expense, id }])
  }

  function deleteExpense(id) {
    setExpenses((current) => current.filter((e) => e.id !== id))
  }

  return (
    <main>
      <h1>Expense Tracker</h1>
      <ExpenseForm onAdd={addExpense} />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
    </main>
  )
}
