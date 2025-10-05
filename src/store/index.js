import { createStore } from 'zustand/vanilla'

import { mockEmployees } from '@/data/mock-employees.js'

const STORAGE_KEY = 'employees-store:v1'

const persist = key => {
  const read = () => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return undefined
      return JSON.parse(raw)
    } catch (e) {
      console.log('Error reading from localStorage', e)
    }
  }

  const write = state => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (e) {
      console.log('Error reading from localStorage', e)
    }
  }

  let cached = read()
  if (!cached) {
    cached = { employees: mockEmployees }
    write(cached)
  }

  return { write, cached }
}

const { write, cached } = persist(STORAGE_KEY)

export const employeeStore = createStore((set, get) => ({
  employees: cached.employees,

  addEmployee: employee => {
    const { employees } = get()
    const created = { ...employee, id: crypto.randomUUID() }
    const next = { employees: [created, ...employees] }
    write(next)
    set(next)
    return created
  },

  updateEmployee: (id, partial) => {
    const { employees } = get()
    const updated = employees.map(e => (e.id === id ? { ...e, ...partial } : e))
    const next = { employees: updated }
    write(next)
    set(next)
  },

  deleteEmployee: id => {
    const { employees } = get()
    const filtered = employees.filter(e => e.id !== id)
    const next = { employees: filtered }
    write(next)
    set(next)
  },

  getById: id => get().employees.find(e => String(e.id) === String(id)),
}))
