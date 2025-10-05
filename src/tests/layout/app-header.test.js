import { Router } from '@vaadin/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/layout/app-header.js'
import * as localization from '@/utils/localization.js'

describe('app-header (added tests)', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('app-header')
    document.body.appendChild(el)
  })

  it('navigates via logo and buttons, closes mobile menu', async () => {
    const goSpy = vi.spyOn(Router, 'go').mockImplementation(() => {})
    await el.updateComplete

    // logo click
    el.shadowRoot.querySelector('.app-header__logo').click()
    expect(goSpy).toHaveBeenCalled()

    // open mobile menu, navigate, then should close
    el._toggleMobileMenu()
    await el.updateComplete
    expect(el.isMobileMenuOpen).toBe(true)
    const addBtn = el.shadowRoot.querySelectorAll('.app-header__buttons button-element')[1]
    addBtn.click()
    await el.updateComplete
    expect(el.isMobileMenuOpen).toBe(false)
  })

  it('changes locale when clicking flags', async () => {
    const setLocaleSpy = vi.spyOn(localization, 'setLocale')
    await el.updateComplete
    const tr = el.shadowRoot.querySelectorAll('.app-header__flag')[0]
    const en = el.shadowRoot.querySelectorAll('.app-header__flag')[1]

    tr.click()
    en.click()
    expect(setLocaleSpy).toHaveBeenCalledTimes(2)
  })
})
