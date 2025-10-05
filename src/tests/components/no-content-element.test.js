import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/no-content-element.js'

describe('no-content-element', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('no-content-element')
    document.body.appendChild(el)
  })

  it('should render with defaults (icon, title, message)', async () => {
    await el.updateComplete

    const root = el.shadowRoot
    const container = root.querySelector('.no-content')
    const icon = root.querySelector('icon-element')
    const title = root.querySelector('.no-content__title')
    const message = root.querySelector('.no-content__message')

    expect(container).toBeTruthy()
    expect(icon).toBeTruthy()
    expect(icon.getAttribute('name')).toBe('user')
    expect(title?.textContent).toBeTruthy()
    expect(message?.textContent).toBeTruthy()
  })

  it('should respect provided title, message, icon', async () => {
    el.title = 'Custom Title'
    el.message = 'Custom Message'
    el.icon = 'grid'
    await el.updateComplete

    const root = el.shadowRoot
    const icon = root.querySelector('icon-element')
    const title = root.querySelector('.no-content__title')
    const message = root.querySelector('.no-content__message')

    expect(icon.getAttribute('name')).toBe('grid')
    expect(title).toHaveTextContent('Custom Title')
    expect(message).toHaveTextContent('Custom Message')
  })

  it('should not render action by default', async () => {
    await el.updateComplete
    const btn = el.shadowRoot.querySelector('button-element')
    expect(btn).toBeNull()
  })

  it('should render action when showAction and use default action text', async () => {
    el.showAction = true
    await el.updateComplete

    const btn = el.shadowRoot.querySelector('button-element')
    expect(btn).toBeTruthy()
    // default text is localized; ensure it has non-empty text content
    expect(btn.textContent?.trim()).toBeTruthy()
  })

  it('should dispatch "action" event when action button clicked', async () => {
    const handler = vi.fn()
    el.addEventListener('action', handler)

    el.showAction = true
    el.actionText = 'Add first'
    await el.updateComplete

    const btn = el.shadowRoot.querySelector('button-element')
    btn.click()
    await el.updateComplete

    expect(handler).toHaveBeenCalledTimes(1)
  })
})
