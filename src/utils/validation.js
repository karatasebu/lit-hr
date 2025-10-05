import * as yup from 'yup'

import { t } from './localization.js'

export const employeeValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required(t('firstNameRequired'))
    .min(2, t('firstNameMinLength'))
    .max(50, t('firstNameMaxLength')),
  lastName: yup
    .string()
    .required(t('lastNameRequired'))
    .min(2, t('lastNameMinLength'))
    .max(50, t('lastNameMaxLength')),
  email: yup
    .string()
    .required(t('emailRequired'))
    .email(t('emailInvalid'))
    .max(100, t('emailMaxLength')),
  phone: yup
    .string()
    .required(t('phoneRequired'))
    // eslint-disable-next-line no-useless-escape
    .matches(/^[+]?[\d\s\-\(\)]{7,20}$/, t('phoneInvalid')),
  dateOfEmployment: yup
    .string()
    .required(t('dateOfEmploymentRequired'))
    .test('is-date', t('dateInvalid'), value => {
      if (!value) return false
      const date = new Date(value)
      return !isNaN(date.getTime())
    }),
  dateOfBirth: yup
    .string()
    .required(t('dateOfBirthRequired'))
    .test('is-date', t('dateInvalid'), value => {
      if (!value) return false
      const date = new Date(value)
      return !isNaN(date.getTime())
    })
    .test('age-check', t('ageMinimum'), value => {
      if (!value) return false
      const birthDate = new Date(value)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18
      }
      return age >= 18
    }),
  department: yup
    .string()
    .required(t('departmentRequired'))
    .min(2, t('departmentMinLength'))
    .max(50, t('departmentMaxLength')),
  position: yup
    .string()
    .required(t('positionRequired'))
    .oneOf(['junior', 'senior', 'manager', 'specialist', 'analyst'], t('positionInvalid')),
})

export async function validateForm(formData) {
  try {
    await employeeValidationSchema.validate(formData, { abortEarly: false })
    return { isValid: true, errors: {} }
  } catch (error) {
    const errors = {}
    error.inner.forEach(err => {
      if (!errors[err.path]) {
        errors[err.path] = []
      }
      errors[err.path].push(err.message)
    })
    return { isValid: false, errors }
  }
}

export async function validateField(fieldName, value) {
  try {
    await yup.reach(employeeValidationSchema, fieldName).validate(value)
    return { isValid: true, error: null }
  } catch (error) {
    return { isValid: false, error: error.message }
  }
}

export async function validateFormWithErrors(formData, _currentErrors = {}) {
  const result = await validateForm(formData)

  if (result.isValid) {
    return { isValid: true, errors: {} }
  }

  return { isValid: false, errors: result.errors }
}

export async function validateFieldWithErrors(fieldName, value, currentErrors = {}) {
  const result = await validateField(fieldName, value)

  if (result.isValid) {
    // Remove error for this field if validation passes
    const newErrors = { ...currentErrors }
    delete newErrors[fieldName]
    return { isValid: true, errors: newErrors }
  } else {
    // Add error for this field
    const newErrors = { ...currentErrors }
    newErrors[fieldName] = [result.error]
    return { isValid: false, errors: newErrors }
  }
}
