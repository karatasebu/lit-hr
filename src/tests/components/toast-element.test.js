import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/toast-element.js'

describe('toast-element', () => {
  let toast

  beforeEach(() => {
    document.body.innerHTML = ''
    toast = document.createElement('toast-element')
    document.body.appendChild(toast)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('should be closed initially', async () => {
    await toast.updateComplete
    const root = toast.shadowRoot
    const container = root.querySelector('.toast')
    expect(toast.open).toBe(false)
    expect(container.className).not.toContain('--open')
  })

  it('should show via event and set message/variant', async () => {
    const message = 'Hello World'
    const variant = 'error'

    window.dispatchEvent(
      new CustomEvent('toast:show', {
        detail: { message, variant, duration: 500 },
      })
    )

    await toast.updateComplete
    const root = toast.shadowRoot
    const container = root.querySelector('.toast')
    const text = root.querySelector('.toast__message')

    expect(toast.open).toBe(true)
    expect(text).toHaveTextContent(message)
    expect(container.className).toContain('--open')
    expect(container.className).toContain(`--${variant}`)
  })

  it('should auto hide after duration', async () => {
    vi.useFakeTimers()
    window.dispatchEvent(
      new CustomEvent('toast:show', {
        detail: { message: 'Short message', duration: 100 },
      })
    )

    await toast.updateComplete
    expect(toast.open).toBe(true)

    vi.advanceTimersByTime(100)
    // wait for Lit update
    await toast.updateComplete

    expect(toast.open).toBe(false)
  })

  it('should hide when close button is clicked', async () => {
    window.dispatchEvent(
      new CustomEvent('toast:show', {
        detail: { message: 'To be closed' },
      })
    )

    await toast.updateComplete
    const closeBtn = toast.shadowRoot.querySelector('button-element')
    // click handler directly sets open=false on host
    closeBtn.click()
    await toast.updateComplete

    expect(toast.open).toBe(false)
  })
})
