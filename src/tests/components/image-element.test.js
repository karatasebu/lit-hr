import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/image-element.js'

describe('image-element', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('image-element')
    document.body.appendChild(el)
  })

  it('should render img with base class', async () => {
    await el.updateComplete
    const img = el.shadowRoot.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.className).toContain('image')
  })

  it('should forward host class to inner img', async () => {
    // Set class BEFORE attaching so first render captures it
    const local = document.createElement('image-element')
    local.setAttribute('class', 'rounded shadow')
    document.body.appendChild(local)
    await local.updateComplete
    const img = local.shadowRoot.querySelector('img')
    expect(img.className).toContain('image')
    expect(img.className).toContain('rounded')
    expect(img.className).toContain('shadow')
  })

  it('should forward common attributes to img', async () => {
    el.alt = 'Sample'
    el.width = '100'
    el.height = '50'
    el.loading = 'lazy'
    el.decoding = 'async'
    el.referrerpolicy = 'no-referrer'
    el.sizes = '(max-width: 600px) 100vw, 50vw'
    el.srcset = 'a 1x, b 2x'
    await el.updateComplete

    const img = el.shadowRoot.querySelector('img')
    expect(img.getAttribute('alt')).toBe('Sample')
    expect(img.getAttribute('width')).toBe('100')
    expect(img.getAttribute('height')).toBe('50')
    expect(img.getAttribute('loading')).toBe('lazy')
    expect(img.getAttribute('decoding')).toBe('async')
    expect(img.getAttribute('referrerpolicy')).toBe('no-referrer')
    expect(img.getAttribute('sizes')).toBe('(max-width: 600px) 100vw, 50vw')
    expect(img.getAttribute('srcset')).toBe('a 1x, b 2x')
  })

  it('should fallback to given src when unresolved', async () => {
    el.src = 'non-existing.png'
    await el.updateComplete
    const img = el.shadowRoot.querySelector('img')
    expect(img.getAttribute('src')).toBe('non-existing.png')
  })

  it('should resolve src via resolveSrc when src changes', async () => {
    // mock instance resolveSrc to control behavior
    const resolvedUrl = 'blob:http://localhost/abc'
    el.resolveSrc = vi.fn().mockResolvedValue(resolvedUrl)

    el.src = 'en-flag.png'
    await el.updateComplete
    // wait a subsequent microtask for requestUpdate in updated()
    await el.updateComplete

    expect(el.resolveSrc).toHaveBeenCalledWith('en-flag.png')
    const img = el.shadowRoot.querySelector('img')
    expect(img.getAttribute('src')).toBe(resolvedUrl)
  })
})
