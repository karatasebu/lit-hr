import { describe, it, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

import '@/layout/app-main.js'

describe('app-main', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('app-main')
    document.body.appendChild(el)
  })

  it('should render a main container with id="main"', async () => {
    await el.updateComplete
    const main = el.shadowRoot.querySelector('main#main')
    expect(main).toBeTruthy()
  })
})
