import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/table-element.js'

describe('table-element', () => {
  let el
  const sampleData = [
    {
      id: 1,
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      position: 'developer',
    },
    {
      id: 2,
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace@example.com',
      position: 'manager',
    },
  ]

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('table-element')
    document.body.appendChild(el)
  })

  it('should render table with headers and rows', async () => {
    el.data = sampleData
    await el.updateComplete

    const table = el.shadowRoot.querySelector('table.table')
    expect(table).toBeTruthy()

    const headers = el.shadowRoot.querySelectorAll('thead th')
    expect(headers.length).toBeGreaterThan(0)

    const rows = el.shadowRoot.querySelectorAll('tbody .table__row')
    expect(rows.length).toBe(2)
  })

  it('should emit row-selection for select-all when selectable', async () => {
    const handler = vi.fn()
    el.addEventListener('row-selection', handler)
    el.selectable = true
    el.data = sampleData
    await el.updateComplete

    const selectAll = el.shadowRoot.querySelector('.table__checkbox--header')
    // simulate custom change coming from checkbox-element with detail.checked
    selectAll.dispatchEvent(
      new CustomEvent('change', { detail: { checked: true }, bubbles: true, composed: true })
    )
    await el.updateComplete

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail).toEqual({
      id: null,
      isChecked: true,
      isSelectAll: true,
    })
  })

  it('should emit row-selection with row id when a row checkbox changes', async () => {
    const handler = vi.fn()
    el.addEventListener('row-selection', handler)
    el.selectable = true
    el.data = sampleData
    await el.updateComplete

    const rowCheckboxes = el.shadowRoot.querySelectorAll(
      'tbody .table__cell--checkbox .table__checkbox'
    )
    rowCheckboxes[1].dispatchEvent(
      new CustomEvent('change', { detail: { checked: true }, bubbles: true, composed: true })
    )
    await el.updateComplete

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail).toEqual({ id: 2, isChecked: true, isSelectAll: false })
  })

  it('should emit edit and delete events with row and index', async () => {
    const editHandler = vi.fn()
    const deleteHandler = vi.fn()
    el.addEventListener('edit', editHandler)
    el.addEventListener('delete', deleteHandler)
    el.data = sampleData
    await el.updateComplete

    const actionCells = el.shadowRoot.querySelectorAll('.table__cell--actions')
    const firstRowActions = actionCells[0]
    const [editBtn, deleteBtn] = firstRowActions.querySelectorAll('button-element')

    editBtn.click()
    deleteBtn.click()
    await el.updateComplete

    expect(editHandler).toHaveBeenCalledTimes(1)
    expect(deleteHandler).toHaveBeenCalledTimes(1)
    const editDetail = editHandler.mock.calls[0][0].detail
    const deleteDetail = deleteHandler.mock.calls[0][0].detail
    expect(editDetail.index).toBe(0)
    expect(editDetail.row.id).toBe(1)
    expect(deleteDetail.index).toBe(0)
    expect(deleteDetail.row.id).toBe(1)
  })
})
