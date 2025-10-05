import { LitElement, html } from 'lit'

import router from '@/router'
import { setLocaleFromUrl } from '@/utils/localization.js'

import '@/layout/app-header.js'
import '@/layout/app-main.js'
import '@/pages/employees-page/index.js'
import '@/pages/form-page.js'
import '@/components/toast-element.js'
import '@/components/modal-element.js'

export class AppRoot extends LitElement {
  async setInitialLocale() {
    const url = new URL(window.location.href)
    if (!url.searchParams.get('locale')) {
      url.searchParams.set('locale', 'en')
      window.history.replaceState(null, '', url.toString())
    }
    await setLocaleFromUrl()
  }

  async firstUpdated() {
    await this.setInitialLocale()
    router(this)
  }

  render() {
    return html`
      <app-header></app-header>
      <app-main></app-main>
      <toast-element></toast-element>
      <modal-element></modal-element>
    `
  }
}

customElements.define('app-root', AppRoot)
