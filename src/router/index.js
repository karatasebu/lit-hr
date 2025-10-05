import { Router } from '@vaadin/router'

import '@/pages/employees-page/index.js'
import '@/pages/form-page.js'

const initRouter = hostElement => {
  const outlet = hostElement.shadowRoot
    .querySelector('app-main')
    ?.shadowRoot?.getElementById('main')
  const router = new Router(outlet)

  router.setRoutes([
    { path: '/', component: 'employees-page' },
    { path: '/form', component: 'form-page' },
    { path: '/form/:id', component: 'form-page' },
  ])
  return router
}

export default initRouter
