import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/components/modal-element.js'

describe('modal-element', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('modal-element')
    document.body.appendChild(el)
  })

  it('should not render when closed by default', async () => {
    await el.updateComplete
    expect(el.open).toBe(false)
    expect(el.shadowRoot.querySelector('.modal__backdrop')).toBeNull()
    expect(el.shadowRoot.querySelector('.modal')).toBeNull()
  })

  it('should open and render content via window modal:show event', async () => {
    const onAccept = vi.fn()
    window.dispatchEvent(
      new CustomEvent('modal:show', {
        detail: {
          title: 'Delete user',
          content: 'Are you sure?',
          width: '500px',
          onAccept,
        },
      })
    )
    await el.updateComplete

    const backdrop = el.shadowRoot.querySelector('.modal__backdrop')
    const modal = el.shadowRoot.querySelector('.modal')
    const title = el.shadowRoot.querySelector('.modal__title')
    const content = el.shadowRoot.querySelector('.modal__content')
    expect(backdrop).toBeTruthy()
    expect(modal).toBeTruthy()
    expect(title).toHaveTextContent('Delete user')
    expect(content).toHaveTextContent('Are you sure?')
    expect(modal.getAttribute('style')).toContain('max-width:500px;')
  })

  it('should close when clicking close button and dispatch close event', async () => {
    const closeHandler = vi.fn()
    el.addEventListener('close', closeHandler)
    window.dispatchEvent(new CustomEvent('modal:show', { detail: { title: 'X' } }))
    await el.updateComplete

    const btn = el.shadowRoot.querySelector('.modal__header button-element')
    btn.click()
    await el.updateComplete
    expect(el.open).toBe(false)
    expect(closeHandler).toHaveBeenCalledTimes(1)
  })

  it('should call onAccept and then close when proceed button is clicked', async () => {
    const onAccept = vi.fn()
    window.dispatchEvent(new CustomEvent('modal:show', { detail: { title: 'X', onAccept } }))
    await el.updateComplete

    const footerButtons = el.shadowRoot.querySelectorAll('.modal__footer button-element')
    // first footer button is proceed
    footerButtons[0].click()
    await el.updateComplete

    expect(onAccept).toHaveBeenCalledTimes(1)
    expect(el.open).toBe(false)
  })

  it('should close when clicking cancel button', async () => {
    window.dispatchEvent(new CustomEvent('modal:show', { detail: { title: 'X' } }))
    await el.updateComplete
    const footerButtons = el.shadowRoot.querySelectorAll('.modal__footer button-element')
    // second footer button is cancel
    footerButtons[1].click()
    await el.updateComplete
    expect(el.open).toBe(false)
  })

  it('should close when clicking on backdrop unless preventOutsideClose is true', async () => {
    // default: should close
    window.dispatchEvent(new CustomEvent('modal:show', { detail: { title: 'X' } }))
    await el.updateComplete

    const backdrop = el.shadowRoot.querySelector('.modal__backdrop')
    backdrop.click()
    await el.updateComplete
    expect(el.open).toBe(false)

    // with preventOutsideClose: should stay open
    window.dispatchEvent(
      new CustomEvent('modal:show', { detail: { title: 'Y', preventOutsideClose: true } })
    )
    await el.updateComplete
    const backdrop2 = el.shadowRoot.querySelector('.modal__backdrop')
    backdrop2.click()
    await el.updateComplete
    expect(el.open).toBe(true)
  })
})
