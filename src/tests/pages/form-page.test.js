import { Router } from '@vaadin/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/pages/form-page.js'
import { employeeStore } from '@/store/index.js'

describe('form-page', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('form-page')
    document.body.appendChild(el)
  })

  it('initializes in add mode with empty form', async () => {
    await el.updateComplete
    expect(el.mode).toBe('add')
    expect(el.form.firstName).toBeDefined()
  })

  it('prefills form in edit mode when URL has id', async () => {
    // put one employee in the store
    const created = employeeStore.getState().addEmployee({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '+1 555 123 4567',
      dateOfEmployment: '05/10/2024',
      dateOfBirth: '10/12/1990',
      department: 'Eng',
      position: 'manager',
    })
    // fake URL
    const url = new URL(window.location.href)
    window.history.replaceState({}, '', `/form/${created.id}${url.search}`)

    const el2 = document.createElement('form-page')
    document.body.appendChild(el2)
    await el2.updateComplete
    expect(el2.mode).toBe('edit')
    expect(el2.form.id).toBe(created.id)
    // dates should be converted to yyyy-mm-dd
    expect(el2.form.dateOfEmployment).toMatch(/\d{4}-\d{2}-\d{2}/)
  })

  it('valid form triggers save and navigation, shows success toast', async () => {
    const goSpy = vi.spyOn(Router, 'go').mockImplementation(() => {})
    const toastSpy = vi.fn()
    window.addEventListener('toast:show', toastSpy)

    // fill in a valid form
    el.form = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2024-05-01',
      dateOfBirth: '1990-01-01',
      phone: '+1 555 123 4567',
      email: 'john@example.com',
      department: 'Engineering',
      position: 'manager',
    }
    await el.updateComplete

    await el._save(new Event('click'))
    await el.updateComplete

    expect(toastSpy).toHaveBeenCalled()
    expect(goSpy).toHaveBeenCalled()
  })

  it('invalid form shows error toast and does not navigate', async () => {
    const goSpy = vi.spyOn(Router, 'go').mockImplementation(() => {})
    const toastSpy = vi.fn()
    window.addEventListener('toast:show', toastSpy)

    el.form = {
      firstName: '',
      lastName: '',
      email: 'bad',
      phone: 'x',
      dateOfEmployment: '',
      dateOfBirth: '',
      department: '',
      position: '',
    }
    await el.updateComplete

    await el._save(new Event('click'))
    await el.updateComplete

    expect(toastSpy).toHaveBeenCalled()
    expect(goSpy).not.toHaveBeenCalled()
  })
})
