import { describe, it, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/button-element.js'

describe('button-element', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('button-element')
    document.body.appendChild(el)
  })

  it('should render native button with default classes', async () => {
    await el.updateComplete
    const btn = el.shadowRoot.querySelector('button')
    expect(btn).toBeTruthy()
    expect(btn.className).toContain('button')
    expect(btn.className).toContain('--md')
    expect(btn.className).toContain('--primary')
  })

  it('should apply colorType modifier and omit variant class when colorType set', async () => {
    el.colorType = 'orange'
    await el.updateComplete
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.className).toContain('--orange')
    expect(btn.className).not.toContain('--primary')
  })

  it('should render icon with size based on button size', async () => {
    el.icon = 'user'
    el.size = 'lg'
    await el.updateComplete
    const icon = el.shadowRoot.querySelector('icon-element')
    expect(icon).toBeTruthy()
    expect(icon.getAttribute('size')).toBe('18')
  })

  it('should respect disabled, title, type, shape, justIcon', async () => {
    el.disabled = true
    el.title = 'Click me'
    el.type = 'submit'
    el.shape = 'rounded'
    el.justIcon = true
    await el.updateComplete
    const btn = el.shadowRoot.querySelector('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('title', 'Click me')
    expect(btn).toHaveAttribute('type', 'submit')
    expect(btn.className).toContain('--rounded')
    expect(btn.className).toContain('--just-icon')
  })
})
