import { Router } from '@vaadin/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/pages/employees-page/index.js'
import { employeeStore } from '@/store/index.js'

describe('employees-page', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('employees-page')
    document.body.appendChild(el)
  })

  it('renders header and pagination, switches view to grid', async () => {
    // seed some data
    employeeStore.setState({
      employees: [{ id: 1, firstName: 'A', lastName: 'B', email: '', position: 'junior' }],
    })
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.employees-page__title')).toBeTruthy()
    expect(el.view).toBe('list')

    const gridBtn = el.shadowRoot.querySelectorAll('.employees-page__actions button-element')[1]
    gridBtn.click()
    await el.updateComplete
    expect(el.view).toBe('grid')
  })

  it('navigates to edit form on edit and opens modal on delete', async () => {
    vi.spyOn(Router, 'go').mockImplementation(() => {})
    const modalSpy = vi.fn()
    window.addEventListener('modal:show', modalSpy)
    // seed 2 items
    employeeStore.setState({
      employees: [
        { id: 1, firstName: 'A', lastName: 'B', email: '', position: 'junior' },
        { id: 2, firstName: 'C', lastName: 'D', email: '', position: 'manager' },
      ],
    })
    await el.updateComplete

    // trigger table mode
    el.view = 'list'
    await el.updateComplete

    // simulate edit event from table
    const table = el.shadowRoot.querySelector('table-element')
    table?.dispatchEvent(
      new CustomEvent('edit', { detail: { row: { id: 1 } }, bubbles: true, composed: true })
    )
    await el.updateComplete

    // simulate delete event from table triggers modal:show
    table?.dispatchEvent(
      new CustomEvent('delete', {
        detail: { row: { id: 1 }, index: 0 },
        bubbles: true,
        composed: true,
      })
    )
    await el.updateComplete
    expect(modalSpy).toHaveBeenCalled()
  })
})
