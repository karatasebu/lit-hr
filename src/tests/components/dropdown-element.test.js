import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/dropdown-element.js'

describe('dropdown-element', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('dropdown-element')
    document.body.appendChild(el)
  })

  it('should render trigger button with default classes and placeholder', async () => {
    await el.updateComplete
    const root = el.shadowRoot
    const trigger = root.querySelector('.dropdown__trigger')
    const container = root.querySelector('.dropdown')

    expect(container).toBeTruthy()
    expect(container.className).toContain('--default')
    expect(container.className).toContain('--md')
    expect(trigger).toBeTruthy()
    const valueSpan = root.querySelector('.dropdown__value')
    expect(valueSpan?.textContent?.trim()).toBeTruthy()
  })

  it('should show label and required asterisk when provided', async () => {
    el.id = 'dept'
    el.label = 'Department'
    el.required = true
    await el.updateComplete

    const label = el.shadowRoot.querySelector('label.dropdown__label')
    expect(label).toBeTruthy()
    expect(label).toHaveAttribute('for', 'dept')
    expect(label.textContent).toContain('*')
  })

  it('should toggle menu open/close on trigger click', async () => {
    await el.updateComplete
    const trigger = el.shadowRoot.querySelector('.dropdown__trigger')

    trigger.click()
    await el.updateComplete
    expect(el.open).toBe(true)
    expect(el.shadowRoot.querySelector('.dropdown__menu')).toBeTruthy()

    trigger.click()
    await el.updateComplete
    expect(el.open).toBe(false)
    expect(el.shadowRoot.querySelector('.dropdown__menu')).toBeNull()
  })

  it('should not open when disabled', async () => {
    el.disabled = true
    await el.updateComplete
    const trigger = el.shadowRoot.querySelector('.dropdown__trigger')
    trigger.click()
    await el.updateComplete
    expect(el.open).toBe(false)
  })

  it('should render options when open and select an option', async () => {
    const changeHandler = vi.fn()
    el.addEventListener('change', changeHandler)

    el.options = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ]
    await el.updateComplete

    el.shadowRoot.querySelector('.dropdown__trigger').click()
    await el.updateComplete

    const options = el.shadowRoot.querySelectorAll('.dropdown__option')
    expect(options.length).toBe(2)

    options[1].click()
    await el.updateComplete

    expect(el.value).toBe('banana')
    expect(el.open).toBe(false)
    expect(changeHandler).toHaveBeenCalledTimes(1)
    const evt = changeHandler.mock.calls[0][0]
    expect(evt.detail.value).toBe('banana')
    expect(evt.detail.label).toBe('Banana')
  })

  it('should mark selected option with --selected class and aria-selected', async () => {
    el.options = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ]
    el.value = 'a'
    await el.updateComplete

    el.shadowRoot.querySelector('.dropdown__trigger').click()
    await el.updateComplete

    const options = Array.from(el.shadowRoot.querySelectorAll('.dropdown__option'))
    const first = options[0]
    const second = options[1]

    expect(first.className).toContain('--selected')
    expect(first.getAttribute('aria-selected')).toBe('true')
    expect(second.className).not.toContain('--selected')
    expect(second.getAttribute('aria-selected')).toBe('false')
  })

  it('should close when clicking outside', async () => {
    await el.updateComplete
    el.shadowRoot.querySelector('.dropdown__trigger').click()
    await el.updateComplete
    expect(el.open).toBe(true)

    // click outside the component
    document.body.click()
    await el.updateComplete
    expect(el.open).toBe(false)
  })

  it('should render error element and set error state when error provided', async () => {
    el.error = 'This field is required'
    await el.updateComplete
    // hasError is set in updated(), which triggers another update
    await el.updateComplete

    const errorEl = el.shadowRoot.querySelector('.dropdown__error')
    expect(errorEl).toBeTruthy()
    expect(errorEl).toHaveTextContent('This field is required')

    const container = el.shadowRoot.querySelector('.dropdown')
    expect(container.className).toContain('--error')
  })
})
