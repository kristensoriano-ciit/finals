import { useState } from 'react'
import { CATEGORIES } from '../lib/categories.js'
import { validateExpense } from '../lib/validateExpense.js'

const EMPTY = { description: '', amount: '', category: CATEGORIES[0] }

export default function ExpenseForm({ onAdd }) {
  const [fields, setFields] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  function update(event) {
    setFields({ ...fields, [event.target.name]: event.target.value })
  }

  function submit(event) {
    event.preventDefault()
    const result = validateExpense(fields)
    setErrors(result.errors)
    if (!result.isValid) return
    onAdd({
      description: fields.description.trim(),
      amount: Number(fields.amount),
      category: fields.category,
    })
    setFields(EMPTY)
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="description">Description</label>
      <input id="description" name="description" value={fields.description} onChange={update} />
      {errors.description && <p role="alert">{errors.description}</p>}

      <label htmlFor="amount">Amount</label>
      <input id="amount" name="amount" inputMode="decimal" value={fields.amount} onChange={update} />
      {errors.amount && <p role="alert">{errors.amount}</p>}

      <label htmlFor="category">Category</label>
      <select id="category" name="category" value={fields.category} onChange={update}>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>
      {errors.category && <p role="alert">{errors.category}</p>}

      <button type="submit">Add expense</button>
    </form>
  )
}
