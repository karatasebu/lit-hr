import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/input-element.js'

describe('input-element', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('input-element')
    document.body.appendChild(el)
  })

  it('should render input with default classes and value', async () => {
    await el.updateComplete
    const input = el.shadowRoot.querySelector('input')
    const containerClass = input.className
    expect(input).toBeTruthy()
    expect(containerClass).toContain('input')
    expect(containerClass).toContain('--default')
    expect(containerClass).toContain('--md')
    expect(input.value).toBe('')
  })

  it('should respect basic attributes and label/required', async () => {
    el.id = 'fname'
    el.name = 'firstName'
    el.placeholder = 'First name'
    el.required = true
    el.label = 'First Name'
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input')
    const label = el.shadowRoot.querySelector('label.input__label')
    expect(input).toHaveAttribute('id', 'fname')
    expect(input).toHaveAttribute('name', 'firstName')
    expect(input).toHaveAttribute('placeholder', 'First name')
    expect(input).toHaveAttribute('required')
    expect(label).toBeTruthy()
    expect(label).toHaveAttribute('for', 'fname')
    expect(label.textContent).toContain('First Name')
    expect(label.textContent).toContain('*')
  })

  it('should render error text and apply --error class when error set', async () => {
    el.error = 'Required field'
    await el.updateComplete
    // hasError is updated in updated(), need another tick
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input')
    const err = el.shadowRoot.querySelector('.input__error')
    expect(err).toBeTruthy()
    expect(err).toHaveTextContent('Required field')
    expect(input.className).toContain('--error')
  })

  it('should update value and dispatch input/change events', async () => {
    const inputHandler = vi.fn()
    const changeHandler = vi.fn()
    el.addEventListener('input', inputHandler)
    el.addEventListener('change', changeHandler)
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input')
    input.value = 'John'
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    await el.updateComplete
    expect(el.value).toBe('John')
    expect(inputHandler).toHaveBeenCalledTimes(1)
    expect(inputHandler.mock.calls[0][0].detail.value).toBe('John')

    // change event on blur
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    await el.updateComplete
    expect(changeHandler).toHaveBeenCalledTimes(1)
    expect(changeHandler.mock.calls[0][0].detail.value).toBe('John')
  })

  it('should dispatch focus and blur with detail', async () => {
    const focusHandler = vi.fn()
    const blurHandler = vi.fn()
    el.addEventListener('focus', focusHandler)
    el.addEventListener('blur', blurHandler)
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input')
    input.value = 'X'
    input.dispatchEvent(new Event('focus', { bubbles: true, composed: true }))
    input.dispatchEvent(new Event('blur', { bubbles: true, composed: true }))
    await el.updateComplete

    expect(focusHandler).toHaveBeenCalledTimes(1)
    expect(blurHandler).toHaveBeenCalledTimes(1)
    expect(focusHandler.mock.calls[0][0].detail.value).toBe('X')
    expect(blurHandler.mock.calls[0][0].detail.value).toBe('X')
  })

  it('should dispatch keydown and keyup with keyboard details; Enter triggers change', async () => {
    const keydownHandler = vi.fn()
    const keyupHandler = vi.fn()
    const changeHandler = vi.fn()
    el.addEventListener('keydown', keydownHandler)
    el.addEventListener('keyup', keyupHandler)
    el.addEventListener('change', changeHandler)
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input')
    input.value = 'Hello'
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'A', bubbles: true, composed: true }))
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'A', bubbles: true, composed: true }))
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true })
    )
    await el.updateComplete

    expect(keydownHandler).toHaveBeenCalled()
    expect(keyupHandler).toHaveBeenCalled()
    expect(changeHandler).toHaveBeenCalled()
    const kd = keydownHandler.mock.calls[0][0].detail
    expect(kd).toMatchObject({ value: 'Hello', key: 'A' })
  })

  it('should propagate value via paste and cut handlers (async)', async () => {
    const inputHandler = vi.fn()
    el.addEventListener('input', inputHandler)
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input')

    input.value = 'abc'
    input.dispatchEvent(new Event('paste', { bubbles: true, composed: true }))
    await new Promise(r => setTimeout(r, 0))
    await el.updateComplete
    expect(inputHandler).toHaveBeenCalled()

    input.value = 'a'
    input.dispatchEvent(new Event('cut', { bubbles: true, composed: true }))
    await new Promise(r => setTimeout(r, 0))
    await el.updateComplete
    expect(inputHandler.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('should dispatch select with selection range details', async () => {
    const selectHandler = vi.fn()
    el.addEventListener('select', selectHandler)
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input')
    input.value = 'abcdef'
    // Set selection range
    input.selectionStart = 1
    input.selectionEnd = 4
    input.dispatchEvent(new Event('select', { bubbles: true, composed: true }))
    await el.updateComplete

    expect(selectHandler).toHaveBeenCalledTimes(1)
    const detail = selectHandler.mock.calls[0][0].detail
    expect(detail.value).toBe('abcdef')
    expect(detail.selectionStart).toBe(1)
    expect(detail.selectionEnd).toBe(4)
  })

  it('date type: click toggles native picker open flag and prevents bubbling on second click', async () => {
    el.type = 'date'
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input')
    // mock showPicker existence
    input.showPicker = vi.fn()

    input.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
    await el.updateComplete
    expect(input.showPicker).toHaveBeenCalledTimes(1)

    // second click should call preventDefault/stopPropagation branch; we just ensure no second showPicker
    input.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
    await el.updateComplete
    expect(input.showPicker).toHaveBeenCalledTimes(1)
  })
})
