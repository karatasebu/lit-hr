import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/pagination-element.js'

describe('pagination-element', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('pagination-element')
    document.body.appendChild(el)
  })

  it('should render with defaults and compute totalPages', async () => {
    await el.updateComplete
    expect(el.page).toBe(1)
    expect(el.pageSize).toBe(10)
    expect(el.total).toBe(0)
    expect(el.totalPages).toBe(1)
    const container = el.shadowRoot.querySelector('.pagination')
    expect(container).toBeTruthy()
  })

  it('should render page buttons and mark active', async () => {
    el.total = 120 // 12 pages
    el.page = 3
    await el.updateComplete
    const btns = el.shadowRoot.querySelectorAll('.pagination__page')
    expect(btns.length).toBeGreaterThan(0)
    const active = el.shadowRoot.querySelector('.pagination__page.--active')
    expect(active).toBeTruthy()
    expect(active.textContent.trim()).toBe('3')
  })

  it('should emit paginate when navigating next/prev within bounds', async () => {
    const handler = vi.fn()
    el.addEventListener('paginate', handler)
    el.total = 50 // 5 pages
    el.page = 2
    await el.updateComplete

    const [prevBtn, , , , , , nextBtn] = el.shadowRoot.querySelectorAll('button-element')
    // click next
    nextBtn.click()
    await el.updateComplete
    expect(handler).toHaveBeenCalledTimes(1)
    expect(el.page).toBe(3)
    expect(handler.mock.calls[0][0].detail).toMatchObject({ page: 3, pageSize: 10 })

    // click prev
    prevBtn.click()
    await el.updateComplete
    expect(handler).toHaveBeenCalledTimes(2)
    expect(el.page).toBe(2)
  })

  it('should disable prev on first page and next on last page', async () => {
    el.total = 20 // 2 pages
    el.page = 1
    await el.updateComplete
    const buttons = el.shadowRoot.querySelectorAll('button-element')
    const prev = buttons[0]
    const next = buttons[buttons.length - 1]
    expect(prev).toHaveAttribute('disabled')

    el.page = 2
    await el.updateComplete
    expect(next).toHaveAttribute('disabled')
  })

  it('should show ellipsis and first/last shortcuts when appropriate', async () => {
    el.total = 200 // 20 pages
    el.page = 10
    await el.updateComplete

    // there should be two ellipsis spans in the middle regions in many cases
    const spans = el.shadowRoot.querySelectorAll('span')
    expect(spans.length).toBeGreaterThanOrEqual(1)

    // first and last shortcut buttons exist
    const firstShortcut = Array.from(el.shadowRoot.querySelectorAll('.pagination__page')).find(
      b => b.textContent.trim() === '1'
    )
    const lastShortcut = Array.from(el.shadowRoot.querySelectorAll('.pagination__page')).find(
      b => b.textContent.trim() === String(el.totalPages)
    )
    expect(firstShortcut).toBeTruthy()
    expect(lastShortcut).toBeTruthy()
  })

  it('should not emit when clicking the currently active page', async () => {
    const handler = vi.fn()
    el.addEventListener('paginate', handler)
    el.total = 100
    el.page = 5
    await el.updateComplete

    const active = el.shadowRoot.querySelector('.pagination__page.--active')
    active.click()
    await el.updateComplete
    expect(handler).not.toHaveBeenCalled()
    expect(el.page).toBe(5)
  })
})
