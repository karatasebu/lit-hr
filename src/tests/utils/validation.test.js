import { describe, it, expect } from 'vitest'

import {
  employeeValidationSchema,
  validateForm,
  validateField,
  validateFormWithErrors,
  validateFieldWithErrors,
} from '@/utils/validation.js'

const valid = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1 555 123 4567',
  dateOfEmployment: '2024-05-01',
  dateOfBirth: '1990-01-01',
  department: 'Engineering',
  position: 'manager',
}

describe('validation utils', () => {
  it('employeeValidationSchema validates a correct object', async () => {
    await expect(employeeValidationSchema.validate(valid)).resolves.toBeTruthy()
  })

  it('validateForm returns isValid true for valid object', async () => {
    const res = await validateForm(valid)
    expect(res.isValid).toBe(true)
    expect(res.errors).toEqual({})
  })

  it('validateForm returns errors for invalid object', async () => {
    const invalid = { ...valid, email: 'nope', firstName: 'A', dateOfBirth: '2015-01-01' }
    const res = await validateForm(invalid)
    expect(res.isValid).toBe(false)
    expect(Object.keys(res.errors).length).toBeGreaterThanOrEqual(1)
  })

  it('validateField ok for valid field and error for invalid', async () => {
    const ok = await validateField('email', 'a@b.com')
    expect(ok.isValid).toBe(true)
    const bad = await validateField('email', 'bad')
    expect(bad.isValid).toBe(false)
    expect(typeof bad.error).toBe('string')
  })

  it('validateFormWithErrors mirrors validateForm shape', async () => {
    const res = await validateFormWithErrors({ ...valid, phone: 'bad' })
    expect(res.isValid).toBe(false)
    expect(res.errors.phone?.length).toBeGreaterThanOrEqual(1)
  })

  it('validateFieldWithErrors updates errors map accordingly', async () => {
    const errors1 = await validateFieldWithErrors('email', 'bad@', {})
    expect(errors1.isValid).toBe(false)
    expect(errors1.errors.email?.length).toBe(1)

    const errors2 = await validateFieldWithErrors('email', 'ok@ok.com', errors1.errors)
    expect(errors2.isValid).toBe(true)
    expect(errors2.errors.email).toBeUndefined()
  })
})
