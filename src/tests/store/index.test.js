import { describe, it, expect, beforeEach } from 'vitest'

import { mockEmployees } from '@/data/mock-employees.js'
import { employeeStore } from '@/store/index.js'

describe('employeeStore', () => {
  const STORAGE_KEY = 'employees-store:v1'

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ employees: mockEmployees }))
  })

  it('initializes with cached employees', () => {
    const state = employeeStore.getState()
    expect(state.employees.length).toBeGreaterThan(0)
  })

  it('addEmployee prepends new employee with uuid and persists', () => {
    const store = employeeStore
    const created = store.getState().addEmployee({ firstName: 'New', lastName: 'User' })
    const state = store.getState()
    expect(state.employees[0].id).toBe(created.id)
    expect(state.employees[0].firstName).toBe('New')

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(Array.isArray(persisted.employees)).toBe(true)
    expect(persisted.employees[0].id).toBe(created.id)
    expect(typeof created.id).toBe('string')
    expect(created.id.length).toBeGreaterThan(0)
  })

  it('updateEmployee modifies correct record and persists', () => {
    const store = employeeStore
    const first = store.getState().employees[0]
    store.getState().updateEmployee(first.id, { firstName: 'Edited' })
    const updated = store.getState().employees.find(e => e.id === first.id)
    expect(updated.firstName).toBe('Edited')

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(persisted.employees.find(e => e.id === first.id).firstName).toBe('Edited')
  })

  it('deleteEmployee removes record and persists', () => {
    const store = employeeStore
    const first = store.getState().employees[0]
    store.getState().deleteEmployee(first.id)
    expect(store.getState().employees.find(e => e.id === first.id)).toBeUndefined()

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(persisted.employees.find(e => e.id === first.id)).toBeUndefined()
  })

  it('getById returns the correct employee', () => {
    const store = employeeStore
    const some = store.getState().employees[0]
    const found = store.getState().getById(some.id)
    expect(found.id).toBe(some.id)
  })
})
