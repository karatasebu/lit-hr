import { describe, it, expect, beforeEach } from 'vitest'

import {
  getLocale,
  setLocale,
  t,
  setLocaleFromUrl,
  onLocaleChange,
  offLocaleChange,
} from '@/utils/localization.js'

describe('localization utils', () => {
  const originalHref = window.location.href

  beforeEach(() => {
    // reset URL
    window.history.replaceState({}, '', originalHref.split('?')[0])
  })

  it('getLocale returns default en when no locale param', () => {
    expect(getLocale()).toBe('en')
  })

  it('setLocale updates URL and notifies listeners', () => {
    let notified = ''
    const unsubscribe = onLocaleChange(l => (notified = l))
    const ok = setLocale('tr')
    expect(ok).toBe(true)
    expect(new URL(window.location.href).searchParams.get('locale')).toBe('tr')
    expect(notified).toBe('tr')
    unsubscribe()
  })

  it('t returns key when translation missing', () => {
    setLocale('en')
    expect(t('nonExistingKey')).toBe('nonExistingKey')
  })

  it('setLocaleFromUrl picks up query param and sets locale', () => {
    const url = new URL(window.location.href)
    url.searchParams.set('locale', 'tr')
    window.history.replaceState({}, '', url)
    const resolved = setLocaleFromUrl()
    expect(resolved).toBe('tr')
    expect(new URL(window.location.href).searchParams.get('locale')).toBe('tr')
  })

  it('offLocaleChange removes listener', () => {
    let count = 0
    const listener = () => count++
    const unsubscribe = onLocaleChange(listener)
    setLocale('en')
    offLocaleChange(listener)
    setLocale('tr')
    expect(count).toBeGreaterThanOrEqual(1)
    unsubscribe()
  })
})
