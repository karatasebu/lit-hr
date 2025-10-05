import { describe, it, expect } from 'vitest'

import { dateUtils } from '@/utils/date.js'

describe('dateUtils', () => {
  it('convertDateForInput should convert dd/mm/yyyy to yyyy-mm-dd', () => {
    expect(dateUtils.convertDateForInput('05/10/2025')).toBe('2025-10-05')
  })

  it('convertDateForInput should return empty string for falsy', () => {
    expect(dateUtils.convertDateForInput('')).toBe('')
    expect(dateUtils.convertDateForInput(undefined)).toBe('')
    expect(dateUtils.convertDateForInput(null)).toBe('')
  })

  it('convertDateForInput should pass-through non dd/mm/yyyy', () => {
    expect(dateUtils.convertDateForInput('2025-10-05')).toBe('2025-10-05')
  })

  it('convertDateForStorage should convert yyyy-mm-dd to dd/mm/yyyy', () => {
    expect(dateUtils.convertDateForStorage('2025-10-05')).toBe('05/10/2025')
  })

  it('convertDateForStorage should return empty string for falsy', () => {
    expect(dateUtils.convertDateForStorage('')).toBe('')
    expect(dateUtils.convertDateForStorage(undefined)).toBe('')
    expect(dateUtils.convertDateForStorage(null)).toBe('')
  })

  it('convertDateForStorage should pass-through non yyyy-mm-dd', () => {
    expect(dateUtils.convertDateForStorage('05/10/2025')).toBe('05/10/2025')
  })
})
