import { useState } from 'react'
import { CATEGORIES } from '../lib/categories.js'
import { filterByCategory, getTotal } from '../lib/expenseSummary.js'
import './ExpenseList.css'

export default function ExpenseList({ expenses, onDelete }) {
  const [filter, setFilter] = useState('All')
  const shown = filterByCategory(expenses, filter)

  return (
    <section className="expense-list">
      <label htmlFor="filter">Filter by category</label>
      <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
        {['All', ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
      </select>

      <p className="total">{`Total: ${getTotal(expenses).toFixed(2)}`}</p>
      {filter !== 'All' && <p>{`${filter} total: ${getTotal(shown).toFixed(2)}`}</p>}

      {shown.length === 0 ? (
        <p>No expenses to show.</p>
      ) : (
        <ul>
          {shown.map((e) => (
            <li key={e.id}>
              <span>{`${e.description} (${e.category}): ${e.amount.toFixed(2)}`}</span>
              <button type="button" aria-label={`Delete ${e.description}`} onClick={() => onDelete(e.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
