import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/checkbox-element.js'

describe('checkbox-element', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('checkbox-element')
    document.body.appendChild(el)
  })

  it('should render input with default classes and unchecked state', async () => {
    await el.updateComplete
    const input = el.shadowRoot.querySelector('input[type="checkbox"]')
    expect(input).toBeTruthy()
    expect(input.className).toContain('checkbox')
    expect(input.className).toContain('--default')
    expect(input.className).toContain('--md')
    expect(input.checked).toBe(false)
  })

  it('should respect provided attributes and label/required', async () => {
    el.id = 'terms'
    el.name = 'terms'
    el.required = true
    el.label = 'Accept Terms'
    el.value = 'yes'
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input[type="checkbox"]')
    const label = el.shadowRoot.querySelector('label.checkbox__label')

    expect(input).toHaveAttribute('id', 'terms')
    expect(input).toHaveAttribute('name', 'terms')
    expect(input).toHaveAttribute('required')
    expect(label).toBeTruthy()
    expect(label).toHaveAttribute('for', 'terms')
    expect(label.textContent).toContain('Accept Terms')
    expect(label.textContent).toContain('*')
  })

  it('should reflect disabled and checked properties', async () => {
    el.disabled = true
    el.checked = true
    await el.updateComplete
    const input = el.shadowRoot.querySelector('input[type="checkbox"]')
    expect(input).toBeDisabled()
    expect(input.checked).toBe(true)
  })

  it('should dispatch change event with detail and update checked on input change', async () => {
    const handler = vi.fn()
    el.addEventListener('change', handler)
    el.value = 'newsletter'
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input[type="checkbox"]')

    // simulate a user toggling the checkbox
    input.checked = true
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    await el.updateComplete

    expect(el.checked).toBe(true)
    expect(handler).toHaveBeenCalledTimes(1)
    const evt = handler.mock.calls[0][0]
    expect(evt.detail.checked).toBe(true)
    expect(evt.detail.value).toBe('newsletter')
  })

  it('should dispatch click, focus and blur events with detail', async () => {
    const clickHandler = vi.fn()
    const focusHandler = vi.fn()
    const blurHandler = vi.fn()
    el.addEventListener('click', clickHandler)
    el.addEventListener('focus', focusHandler)
    el.addEventListener('blur', blurHandler)
    el.value = 'opt-in'
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input[type="checkbox"]')

    input.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
    input.dispatchEvent(new Event('focus', { bubbles: true, composed: true }))
    input.dispatchEvent(new Event('blur', { bubbles: true, composed: true }))
    await el.updateComplete

    // With component stopping native propagation, only custom events should be observed exactly once
    expect(clickHandler).toHaveBeenCalledTimes(1)
    expect(focusHandler).toHaveBeenCalledTimes(1)
    expect(blurHandler).toHaveBeenCalledTimes(1)

    const clickEvt = clickHandler.mock.calls[0][0]
    const focusEvt = focusHandler.mock.calls[0][0]
    const blurEvt = blurHandler.mock.calls[0][0]

    expect(clickEvt.detail.value).toBe('opt-in')
    expect(focusEvt.detail.value).toBe('opt-in')
    expect(blurEvt.detail.value).toBe('opt-in')
  })

  it('should show error text and apply --error class on input when error set', async () => {
    el.error = 'Required field'
    await el.updateComplete
    // hasError is set in updated() on next cycle
    await el.updateComplete

    const input = el.shadowRoot.querySelector('input[type="checkbox"]')
    const err = el.shadowRoot.querySelector('.checkbox__error')

    expect(err).toBeTruthy()
    expect(err).toHaveTextContent('Required field')
    expect(input.className).toContain('--error')
  })
})
