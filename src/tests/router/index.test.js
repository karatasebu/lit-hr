import { describe, it, expect, beforeEach } from 'vitest'

import initRouter from '@/router/index.js'

// Minimal host with nested app-main and #main to satisfy initRouter's query
class AppMainMock extends HTMLElement {
  constructor() {
    super()
    const sr = this.attachShadow({ mode: 'open' })
    const main = document.createElement('div')
    main.id = 'main'
    sr.appendChild(main)
  }
}
customElements.define('app-main', AppMainMock)

describe('router', () => {
  let host

  beforeEach(() => {
    document.body.innerHTML = ''
    host = document.createElement('div')
    const sr = host.attachShadow({ mode: 'open' })
    const appMain = document.createElement('app-main')
    sr.appendChild(appMain)
    document.body.appendChild(host)
  })

  it('initializes Router with outlet and sets routes', () => {
    const router = initRouter(host)
    expect(router).toBeTruthy()
    // @vaadin/router exposes getRoutes()
    const routes = router.getRoutes()
    const paths = routes.map(r => r.path)
    expect(paths).toEqual(['/', '/form', '/form/:id'])
  })
})
