import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/icon-element.js'

describe('icon-element', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('icon-element')
    document.body.appendChild(el)
  })

  it('should render wrapper with base class and default size', async () => {
    await el.updateComplete
    const span = el.shadowRoot.querySelector('span')
    expect(span).toBeTruthy()
    expect(span.className).toContain('icon')
    // default size is 16px; style attribute contains width/height
    expect(span.getAttribute('style')).toContain('width:16px;')
    expect(span.getAttribute('style')).toContain('height:16px;')
  })

  it('should apply colorType as modifier class', async () => {
    el.colorType = 'primary'
    await el.updateComplete
    const span = el.shadowRoot.querySelector('span')
    expect(span.className).toContain('--primary')
  })

  it('should set accessibility attributes (role, aria-hidden, title)', async () => {
    // role defaults to img
    await el.updateComplete
    const span1 = el.shadowRoot.querySelector('span')
    expect(span1.getAttribute('role')).toBe('img')

    // when provided, aria-hidden and title should reflect
    el.ariaHidden = true
    el.title = 'User icon'
    await el.updateComplete
    const span2 = el.shadowRoot.querySelector('span')
    expect(span2.getAttribute('aria-hidden')).toBe('true')
    expect(span2.getAttribute('title')).toBe('User icon')

    // when false, attribute becomes "false" (string) due to lit behavior
    el.ariaHidden = false
    await el.updateComplete
    const span3 = el.shadowRoot.querySelector('span')
    expect(span3.getAttribute('aria-hidden')).toBe('false')
  })

  it('should render resolved SVG when name changes', async () => {
    const svgMarkup = '<svg viewBox="0 0 16 16"><path d="M0 0h16v16z"/></svg>'
    el.resolveSvg = vi.fn().mockResolvedValue(svgMarkup)

    el.name = 'grid'
    await el.updateComplete
    // a subsequent update is requested in updated()
    await el.updateComplete

    expect(el.resolveSvg).toHaveBeenCalledWith('grid')
    const span = el.shadowRoot.querySelector('span')
    expect(span.innerHTML).toContain('<svg')
  })

  it('should not render svg when cannot resolve name', async () => {
    el.resolveSvg = vi.fn().mockResolvedValue(undefined)
    el.name = 'non-existing'
    await el.updateComplete
    await el.updateComplete

    const span = el.shadowRoot.querySelector('span')
    expect(span.querySelector('svg')).toBeNull()
  })
})
